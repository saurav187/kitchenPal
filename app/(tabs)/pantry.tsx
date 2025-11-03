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
};

export default function Pantry() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "pantryItems"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const arr: Item[] = snapshot.docs.map((d) => ({
            id: d.id,
            itemName: d.data().itemName || "Unnamed Item",
            quantity: d.data().quantity || "N/A",
            expiry: d.data().expiry || "N/A",
          }));
          setItems(arr);
          setLoading(false);
          setRefreshing(false);
        },
        (error) => {
          console.error("Error fetching pantry items:", error);
          Alert.alert("Error", "Failed to load pantry items.");
          setLoading(false);
          setRefreshing(false);
        }
      );

      return unsub;
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Unexpected error occurred.");
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "pantryItems", id));
      Alert.alert("Deleted", "Item removed successfully!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to delete item.");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

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
      className="flex-1 bg-white px-6 pt-14"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-2xl font-bold text-gray-800 mb-6">My Pantry</Text>

      {items.length === 0 ? (
        <Text className="text-gray-500 text-center mt-20">
          No items yet. Add your first item!
        </Text>
      ) : (
        items.map((item) => (
          <View
            key={item.id}
            className="flex-row justify-between items-center bg-[#F1F8E9] rounded-xl mb-4 p-4"
          >
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                {item.itemName}
              </Text>
              <Text className="text-gray-600 text-sm">
                Qty: {item.quantity}
              </Text>
              <Text className="text-[#388E3C] text-sm font-medium">
                Exp: {item.expiry}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                Alert.alert("Confirm Delete", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", onPress: () => handleDelete(item.id) },
                ])
              }
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
