import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { auth } from "../../firebaseConfig";
import { getUserProfile } from "../services/userService";

export default function ProfileView() {
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // --------------------------------
  // LOAD PROFILE DATA
  // --------------------------------
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const data = await getUserProfile(user.uid);
      setProfile(data || null); // No redirect even if null
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-5">
        <Text className="text-lg text-gray-700">No profile found.</Text>

        <Pressable
          onPress={() => router.replace("/")}
          className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Home</Text>
        </Pressable>
      </View>
    );
  }

  const address = profile.address || {};

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Your Profile
      </Text>

      {/* Basic Details */}
      <View className="bg-gray-100 p-5 rounded-xl mb-5">
        <Text className="text-xl font-semibold mb-2">Basic Details</Text>

        <Text className="text-lg mb-1">Full Name: {profile.fullName}</Text>
        <Text className="text-lg mb-1">Phone: {profile.phone}</Text>
        {profile.gender && (
          <Text className="text-lg mb-1">Gender: {profile.gender}</Text>
        )}
      </View>

      {/* Address */}
      <View className="bg-gray-100 p-5 rounded-xl mb-5">
        <Text className="text-xl font-semibold mb-2">Address</Text>

        <Text className="text-lg">{address.house}</Text>
        <Text className="text-lg">{address.area}</Text>
        <Text className="text-lg">
          {address.city}, {address.state}
        </Text>
        <Text className="text-lg">Pincode: {address.pincode}</Text>
      </View>

      {/* GPS */}
      <View className="bg-gray-100 p-5 rounded-xl mb-5">
        <Text className="text-xl font-semibold mb-2">GPS Location</Text>

        <Text className="text-lg">Latitude: {address.latitude}</Text>
        <Text className="text-lg">Longitude: {address.longitude}</Text>
      </View>

      {/* Logout */}
      <Pressable
        onPress={async () => {
          try {
            await auth.signOut();
            router.replace("/");
          } catch (err: any) {
            Alert.alert("Logout failed", err.message || String(err));
          }
        }}
        className="bg-red-600 w-full py-4 rounded-xl items-center"
      >
        <Text className="text-white text-lg font-bold">Logout</Text>
      </Pressable>
    </ScrollView>
  );
}
