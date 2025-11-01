// app/(tabs)/pantry.tsx
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { auth, db } from "../../firebaseConfig";

type Item = {
  id: string;
  itemName: string;
  quantity: string;
  expiry: string;
};

export default function Pantry() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const arr: Item[] = snapshot.docs.map((doc) => {
          const data: any = doc.data();
          return {
            id: doc.id,
            itemName: data.itemName || "",
            quantity: data.quantity || "",
            expiry: data.expiry || "",
          };
        });
        setItems(arr);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-14">
      <Text className="text-2xl font-bold text-gray-800 mb-6">My Pantry</Text>

      {items.length === 0 && (
        <View className="items-center mt-20">
          <Image
            source={require("../../assets/images/kitchen_pantry1.png")}
            className="w-60 h-60 mb-6"
            resizeMode="contain"
          />
          <Text className="text-gray-600">No items yet. Add your first item!</Text>
        </View>
      )}

      {items.map((item) => (
        <View
          key={item.id}
          className="flex-row items-center bg-[#F9F9F9] rounded-xl mb-4 p-4 shadow-sm"
        >
          <Image
            source={require("../../assets/images/react-logo.png")}
            className="w-16 h-16 rounded-lg mr-4"
            resizeMode="cover"
          />
          <View>
            <Text className="text-lg font-semibold text-gray-800">{item.itemName}</Text>
            <Text className="text-gray-500 text-sm">Qty: {item.quantity}</Text>
            <Text className="text-[#4CAF50] text-sm font-medium">Exp: {item.expiry}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
