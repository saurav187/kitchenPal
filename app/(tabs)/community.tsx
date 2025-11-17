// app/(tabs)/community.tsx

import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

type Bundle = {
  id: string;
  userId: string;
  userName: string;
  phone?: string;
  address?: string;
  lat?: number | string | null;
  lon?: number | string | null;
  items: { itemName: string; quantity?: string; expiry?: string }[];
  timestamp?: any;
};

export default function Community() {
  const router = useRouter();
  const me = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [filter, setFilter] = useState<"others" | "mine">("others");

  useEffect(() => {
    const q = query(
      collection(db, "shared_bundles"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Bundle[];

        setBundles(arr);
        setLoading(false);
      },
      (err) => {
        console.error("Bundles snapshot error", err);
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  const handleDelete = async (bundleId: string) => {
    Alert.alert("Confirm", "Remove this shared item from community?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "shared_bundles", bundleId));
            Alert.alert("Deleted", "Bundle removed.");
          } catch (err) {
            console.error("Delete error", err);
            Alert.alert("Error", "Could not delete item.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // FILTER LOGIC
  const filtered = bundles.filter((b) => {
    if (!me) return false;

    if (filter === "mine") return b.userId === me.uid;
    else return b.userId !== me.uid;
  });

  return (
    <View className="flex-1 bg-white p-4 mt-10">

      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-7">
        <Text className="text-2xl font-bold">Community Sharing</Text>

        <Pressable
          onPress={() => router.push("/(extra)/shareItem")}
          className="bg-green-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-bold">Share</Text>
        </Pressable>
      </View>

      {/* FILTER BUTTONS */}
      {/* FILTER BUTTONS */}
      <View className="flex-row gap-3 mb-6">
        {["others", "mine"].map((f) => (
          <Pressable
          key={f}
          onPress={() => setFilter(f as any)}
          className={`flex-1 py-3 rounded-xl border items-center justify-center ${
          filter === f ? "bg-[#4CAF50] border-[#4CAF50]" : "border-gray-300"
        }`}
      >
      <Text
        className={`font-semibold ${
          filter === f ? "text-white" : "text-gray-700"
        }`}
      >
        {f === "others" ? "Others" : "My Shares"}
      </Text>
    </Pressable>
  ))}
</View>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <Text className="text-gray-500 text-center mt-20">
          No item in this section.
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => {
            const isOwner = me && me.uid === item.userId;
            return (
              <View className="bg-gray-100 p-4 rounded-xl mb-4">
                <Text className="text-lg font-semibold">{item.userName}</Text>
                {item.address ? (
                  <Text className="text-sm text-gray-700">{item.address}</Text>
                ) : null}

                {item.phone ? (
                  <Pressable onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                    <Text className="text-blue-600 mt-2">
                      Call: {item.phone}
                    </Text>
                  </Pressable>
                ) : null}

                <View className="mt-3">
                  <Text className="font-semibold mb-2">Items in bundle:</Text>
                  {item.items.map((it, idx) => (
                    <View key={idx} className="mb-1">
                      <Text className="text-base">
                        • {it.itemName} — {it.quantity || "N/A"}{" "}
                        {it.expiry ? ` (exp: ${it.expiry})` : ""}
                      </Text>
                    </View>
                  ))}
                </View>

                {isOwner && (
                  <Pressable
                    onPress={() => handleDelete(item.id)}
                    className="self-end bg-red-500 px-4 py-2 rounded-lg mt-3"
                    >
                    <Text className="text-white font-semibold">Delete</Text>
                  </Pressable>
                )}

              </View>
            );
          }}
        />
      )}
    </View>
  );
}
