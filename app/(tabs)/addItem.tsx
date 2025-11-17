import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function AddItem() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
    if (!itemName.trim()) return setSuccessMessage("Please enter an item name.");
    if (isNaN(Number(quantity)) || Number(quantity) <= 0)
      return setSuccessMessage("Quantity must be a positive number.");
    if (!expiry.trim()) return setSuccessMessage("Please select an expiry date.");

    // ✅ Check expiry date must be in future
    const today = new Date();
    const expiryDate = new Date(expiry);
    today.setHours(0, 0, 0, 0);
    if (expiryDate <= today)
      return setSuccessMessage("Expiry date must be after today.");

    try {
      const user = auth.currentUser;
      if (!user) return setSuccessMessage("You must be logged in.");

      const q = query(
        collection(db, "pantryItems"),
        where("userId", "==", user.uid),
        where("itemName", "==", itemName.trim())
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty)
        return setSuccessMessage("This item already exists.");

      // ✅ ADD ITEM
      await addDoc(collection(db, "pantryItems"), {
        userId: user.uid,
        itemName: itemName.trim(),
        quantity: quantity.trim(),
        expiry: expiry.trim(),
        createdAt: Timestamp.now(),
      });

      // ✅ Clear fields
      setItemName("");
      setQuantity("");
      setExpiry("");

      // ✅ Show success message for 2 seconds
      setSuccessMessage("✅ Item saved successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);

    } catch (err) {
      console.error(err);
      setSuccessMessage("Error saving item. Try again.");
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

        {/* ✅ Success or Error Message */}
        {successMessage !== "" && (
          <View className="mt-4">
            <Text className="text-center text-green-600 font-semibold">
              {successMessage}
            </Text>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
