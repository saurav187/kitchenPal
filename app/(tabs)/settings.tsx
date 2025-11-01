// app/(tabs)/settings.tsx
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { auth } from "../../firebaseConfig";

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Logout failed", err.message || String(err));
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Settings</Text>
      <Text className="text-gray-600 mb-10 text-center">
        Manage your account or log out of SmartPantry.
      </Text>

      <Pressable
        onPress={handleLogout}
        className="bg-[#4CAF50] w-full py-4 rounded-xl items-center shadow-md active:bg-[#43A047]"
      >
        <Text className="text-white text-lg font-bold">Logout</Text>
      </Pressable>
    </View>
  );
}
