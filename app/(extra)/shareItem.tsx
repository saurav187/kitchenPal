// app/(tabs)/shareItem.tsx
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../../firebaseConfig";

type PantryItem = {
  id: string;
  itemName: string;
  quantity?: string;
  expiry?: string;
};

export default function ShareItem() {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<PantryItem[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        Alert.alert("Not logged in");
        router.replace("/");
        return;
      }

      try {
        // Load profile
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) setProfile(snap.data());

        // Load pantry items (non-shared)
        const q = query(
          collection(db, "pantryItems"),
          where("userId", "==", user.uid)
        );

        const res = await getDocs(q);
        const arr = res.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));

        setInventory(arr);
      } catch {
        Alert.alert("Error", "Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async () => {
    const selectedIds = Object.keys(selected).filter((id) => selected[id]);

    if (selectedIds.length === 0)
      return Alert.alert("Select items", "Please select at least one item.");

    if (!profile)
      return Alert.alert("Missing Profile", "Please complete your profile.");

    const bundleItems = selectedIds.map((id) => {
      const it = inventory.find((i) => i.id === id)!;
      return {
        itemName: it.itemName,
        quantity: it.quantity || "N/A",
        expiry: it.expiry || "N/A",
      };
    });

    const addr = profile.address || {};

    const payload = {
      userId: user!.uid,
      userName: profile.fullName || "Unknown",
      phone: profile.phone || "",
      address: `${addr.house || ""}, ${addr.area || ""}, ${
        addr.city || ""
      }`.replace(/^[, ]+|[, ]+$/g, ""),
      lat: addr.latitude || null,
      lon: addr.longitude || null,
      items: bundleItems,
      timestamp: serverTimestamp(),
    };

    setSaving(true);
    try {
      // Create shared bundle
      await addDoc(collection(db, "shared_bundles"), payload);

      // Delete pantry items after sharing
      for (const id of selectedIds) {
        await deleteDoc(doc(db, "pantryItems", id));
      }

      Alert.alert("Shared!", "Your bundle was shared successfully.");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Could not share items.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Share Items</Text>

      {inventory.length === 0 ? (
        <View className="items-center mt-20">
          <Text className="text-gray-600">No items in pantry.</Text>
        </View>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => {
            const isSel = !!selected[item.id];
            return (
              <TouchableOpacity
                onPress={() => toggle(item.id)}
                className={`p-4 mb-3 rounded-xl ${
                  isSel ? "bg-green-200" : "bg-gray-100"
                }`}
              >
                <Text className="text-lg font-semibold">{item.itemName}</Text>
                <Text className="text-gray-600">
                  Qty: {item.quantity || "N/A"}
                </Text>
                <Text className="text-gray-600">
                  Expiry: {item.expiry || "N/A"}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <Pressable
        disabled={saving}
        onPress={handleShare}
        className="bg-green-600 p-4 rounded-xl mt-4"
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-center">
            Share Selected Items
          </Text>
        )}
      </Pressable>
    </View>
  );
}
