// app/(tabs)/addItem.tsx
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!itemName.trim() || !quantity.trim() || !expiry.trim()) {
      Alert.alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "pantryItems"), {
        userId: user ? user.uid : "guest",
        itemName: itemName.trim(),
        quantity: quantity.trim(),
        expiry: expiry.trim(),
        createdAt: new Date(),
      });
      Alert.alert("Item saved!");
      setItemName("");
      setQuantity("");
      setExpiry("");
    } catch (err: any) {
      Alert.alert("Save failed", err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Add Item</Text>

      <TextInput
        value={itemName}
        onChangeText={setItemName}
        className="w-full px-4 py-4 bg-[#E8F5E9] rounded-xl text-lg mb-5"
        placeholder="Item Name"
      />
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        className="w-full px-4 py-4 bg-[#E8F5E9] rounded-xl text-lg mb-5"
        placeholder="Quantity"
      />
      <TextInput
        value={expiry}
        onChangeText={setExpiry}
        className="w-full px-4 py-4 bg-[#E8F5E9] rounded-xl text-lg mb-8"
        placeholder="Expiry Date (YYYY-MM-DD)"
      />

      <Pressable
        onPress={handleSave}
        className="bg-[#4CAF50] py-4 rounded-xl items-center"
        disabled={loading}
      >
        <Text className="text-white text-lg font-bold">{loading ? "Saving..." : "Save Item"}</Text>
      </Pressable>
    </View>
  );
}
