import { useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

type Item = {
  id: string;
  itemName: string;
  expiry: string;
};

export default function Home() {
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [sharedBundles, setSharedBundles] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Load pantry items
    const q = query(
      collection(db, "pantryItems"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub1 = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        itemName: d.data().itemName,
        expiry: d.data().expiry,
      }));
      setItems(arr);
      setLoading(false);
    });

    // Load shared bundle count from shared_bundles
    const q2 = query(
      collection(db, "shared_bundles"),
      where("userId", "==", user.uid)
    );

    const unsub2 = onSnapshot(q2, (snap) => {
      setSharedBundles(snap.size);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const today = new Date();

  const expiredCount = items.filter(
    (i) => new Date(i.expiry) < today
  ).length;

  const nearExpiryCount = items.filter((i) => {
    const diff =
      (new Date(i.expiry).getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  }).length;

  const totalCount = items.length;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 mt-3">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">

      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-3xl font-extrabold text-gray-800">
          Kitchen Pal
        </Text>

        <Pressable
          onPress={() => router.push("/(extra)/profile")}
          className="w-14 h-14 bg-gray-200 rounded-full justify-center items-center"
        >
          <Text className="text-xl font-bold text-gray-700">P</Text>
        </Pressable>
      </View>

      {/* IMAGE BANNER */}
      <Image
        source={require("../../assets/images/kitchen_pantry1.png")}
        className="w-full h-72 rounded-2xl mb-8"
        resizeMode="cover"
      />

      {/* ANALYTICS */}
      <Text className="text-xl font-semibold text-gray-800 mb-3">
        Inventory Overview
      </Text>

      <View className="flex-row flex-wrap justify-between mb-8">

        <View className="w-[48%] bg-[#E8F5E9] p-4 rounded-xl mb-4">
          <Text className="text-gray-600">Total Items</Text>
          <Text className="text-3xl font-bold text-[#2E7D32]">{totalCount}</Text>
        </View>

        <View className="w-[48%] bg-[#FFFDE7] p-4 rounded-xl mb-4">
          <Text className="text-gray-600">Near Expiry</Text>
          <Text className="text-3xl font-bold text-[#F9A825]">{nearExpiryCount}</Text>
        </View>

        <View className="w-[48%] bg-[#FFEBEE] p-4 rounded-xl mb-4">
          <Text className="text-gray-600">Expired</Text>
          <Text className="text-3xl font-bold text-[#C62828]">{expiredCount}</Text>
        </View>

        {/* FIXED SHARED COUNT */}
        <View className="w-[48%] bg-[#E3F2FD] p-4 rounded-xl mb-4">
          <Text className="text-gray-600">Shared Items</Text>
          <Text className="text-3xl font-bold text-[#1565C0]">{sharedBundles}</Text>
        </View>

      </View>

      {/* ADD ITEM */}
      <Pressable
        onPress={() => router.push("/(tabs)/addItem")}
        className="bg-[#4CAF50] py-4 rounded-xl items-center shadow-md active:bg-[#43A047] mb-5"
      >
        <Text className="text-white text-lg font-bold">Add New Item</Text>
      </Pressable>

      {/* SHARE ITEM */}
      <Pressable
        onPress={() => router.push("../(extra)/shareItem")}
        className="bg-[#1565C0] py-4 rounded-xl items-center shadow-md active:bg-[#0D47A1]"
      >
        <Text className="text-white text-lg font-bold">Share an Item</Text>
      </Pressable>

    </ScrollView>
  );
}
