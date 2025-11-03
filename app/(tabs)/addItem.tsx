import DateTimePicker from "@react-native-community/datetimepicker";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput
} from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (!itemName.trim()) {
      Alert.alert("Missing Field", "Please enter an item name.");
      return;
    }
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      Alert.alert("Invalid Quantity", "Quantity must be a positive number.");
      return;
    }
    if (!expiry.trim()) {
      Alert.alert("Missing Field", "Please select an expiry date.");
      return;
    }

    // ✅ Check that expiry is after today's date
    const today = new Date();
    const expiryDate = new Date(expiry);
    today.setHours(0, 0, 0, 0); // ignore time part
    if (expiryDate <= today) {
      Alert.alert(
        "Invalid Date",
        "Expiry date must be after today's date."
      );
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in to add items.");
        return;
      }

      await addDoc(collection(db, "pantryItems"), {
        userId: user.uid,
        itemName: itemName.trim(),
        quantity: quantity.trim(),
        expiry: expiry.trim(),
        createdAt: Timestamp.now(),
      });

      // Clear fields after save
      setItemName("");
      setQuantity("");
      setExpiry("");

      Alert.alert("Success", "Item saved successfully!");
    } catch (err: unknown) {
      console.error("Error saving item:", err);
      Alert.alert("Error", "Failed to save item. Please try again.");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setExpiry(formatted);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 56 }}>
        <Text className="text-2xl font-bold text-gray-800 mb-6">Add Item</Text>

        <TextInput
          value={itemName}
          onChangeText={setItemName}
          placeholder="Item Name"
          className="w-full px-4 py-4 bg-[#E8F5E9] rounded-xl text-lg mb-5"
        />

        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Quantity"
          keyboardType="numeric"
          className="w-full px-4 py-4 bg-[#E8F5E9] rounded-xl text-lg mb-5"
        />

        {/* ✅ Web fallback and mobile picker */}
        {Platform.OS === "web" ? (
          <TextInput
            value={expiry}
            onChangeText={setExpiry}
            placeholder="Expiry Date (YYYY-MM-DD)"
            className="w-full px-4 py-4 bg-[#E8F5E9] rounded-xl text-lg mb-8"
          />
        ) : (
          <>
            <Pressable
              onPress={() => setShowPicker(true)}
              className="w-full px-4 py-4 bg-[#E8F5E9] rounded-xl text-lg mb-8"
            >
              <Text className="text-gray-700">
                {expiry ? expiry : "Select Expiry Date"}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </>
        )}

        <Pressable
          onPress={handleSave}
          className="py-4 rounded-xl items-center bg-[#4CAF50]"
        >
          <Text className="text-white text-lg font-bold">Save Item</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
