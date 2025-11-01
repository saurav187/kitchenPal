// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../../firebaseConfig";

export default function TabLayout() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // if not logged in, redirect to login
        router.replace("/login");
      } else {
        // if logged in and current route is login/index, ensure we are in tabs
        // do nothing here — user can navigate within tabs
      }
      if (initializing) setInitializing(false);
    });

    return () => unsub();
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen name="pantry" options={{ title: "List", headerShown: true }} />
      <Tabs.Screen name="addItem" options={{ title: "Add Item", headerShown: true }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", headerShown: true }} />
    </Tabs>
  );
}
