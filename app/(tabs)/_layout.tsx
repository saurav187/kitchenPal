import { Tabs, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../../firebaseConfig";

export default function TabLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4CAF50",
        tabBarLabelStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen name="pantry" options={{ title: "Pantry", headerShown: true }} />
      <Tabs.Screen name="addItem" options={{ title: "Add Item", headerShown: true }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", headerShown: true }} />
    </Tabs>
  );
}
