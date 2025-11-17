import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

type Item = {
  id: string;
  itemName: string;
  quantity: string;
  expiry: string;
  isShared?: boolean;
};

export default function Pantry() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] =
    useState<"all" | "near" | "expired">("all"); // removed 'shared'

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "pantryItems"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: Item[] = snapshot.docs.map((d) => ({
        id: d.id,
        itemName: d.data().itemName || "",
        quantity: d.data().quantity || "",
        expiry: d.data().expiry || "",
        isShared: d.data().isShared || false,
      }));

      // ❗ REMOVE SHARED ITEMS
      const pantryOnly = list.filter((item) => item.isShared !== true);

      setItems(pantryOnly);
      setLoading(false);
      setRefreshing(false);
    });

    return unsub;
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "pantryItems", id));
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const today = new Date();

  // FILTERING
  const filtered = items.filter((item) => {
    const exp = new Date(item.expiry);

    switch (filter) {
      case "expired":
        return exp < today;

      case "near":
        const diff =
          (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 3;

      default:
        return true;
    }
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 mt-3">Loading pantry...</Text>
      </View>
    );
  }

  return (

    

    <ScrollView
      className="flex-1 bg-white px-6 pt-4 mt-10"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      }
    >
      
      <View className="flex-row justify-between items-center mb-7">
        <Text className="text-3xl font-extrabold text-gray-800">
          Inventory
        </Text>
      </View>


      {/* FILTER BUTTONS */}
      <View className="flex-row justify-between mb-6">
        {["all", "near", "expired"].map((f) => (
          <Pressable
          key={f}
          onPress={() => setFilter(f as any)}
          className={`flex-1 mx-1 py-2 rounded-full border ${
          filter === f ? "bg-[#4CAF50] border-[#4CAF50]" : "border-gray-300"
        }`}
      >
      <Text
        className={`text-center font-semibold ${
          filter === f ? "text-white" : "text-gray-700"
        }`}
      >
        {f === "all"
          ? "All"
          : f === "near"
          ? "Near Expiry"
          : "Expired"}
      </Text>
    </Pressable>
  ))}
</View>


      {/* ITEMS */}
      {filtered.length === 0 ? (
        <Text className="text-gray-500 text-center mt-20">
          No items under this filter.
        </Text>
      ) : (
        filtered.map((item) => (
          <View
            key={item.id}
            className="flex-row justify-between items-center bg-[#F1F8E9] rounded-xl mb-4 p-4"
          >
            <View>
              <Text className="text-lg font-semibold">{item.itemName}</Text>
              <Text className="text-gray-600">Qty: {item.quantity}</Text>
              <Text className="text-green-700 font-medium">
                Exp: {item.expiry}
              </Text>
            </View>

            <Pressable
              onPress={() => handleDelete(item.id)}
              className="bg-red-500 px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">Delete</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}
