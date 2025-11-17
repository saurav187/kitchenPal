import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { saveUserProfile } from "./services/userService";

export default function ProfileScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  // Basic Details
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  // Address
  const [house, setHouse] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // GPS
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // ----------------------------
  // Get GPS Location
  // ----------------------------
  const getLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLatitude(String(loc.coords.latitude));
      setLongitude(String(loc.coords.longitude));
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to get GPS location");
    } finally {
      setLoadingLocation(false);
    }
  };

  // ----------------------------
  // SAVE PROFILE
  // ----------------------------
  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    if (!fullName || !phone || !house || !area || !city || !state || !pincode) {
      Alert.alert("Missing Info", "Please fill all required fields.");
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert("Location Missing", "Please get your GPS location.");
      return;
    }

    setSaving(true);

    const payload = {
      fullName,
      phone,
      gender: gender || null,
      address: {
        house,
        area,
        city,
        state,
        pincode,
        latitude,
        longitude,
      },
    };

    const ok = await saveUserProfile(user.uid, payload);

    setSaving(false);

    if (ok) {
      Alert.alert("Success", "Profile updated!");
      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white p-5"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Text className="text-2xl font-bold mb-5">Complete Your Profile</Text>

      {/* BASIC DETAILS */}
      <Text className="text-lg font-semibold mt-4 mb-3">Basic Details</Text>

      <TextInput
        className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />

      <TextInput
        className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        placeholder="Gender (optional)"
        value={gender}
        onChangeText={setGender}
      />

      {/* ADDRESS DETAILS */}
      <Text className="text-lg font-semibold mt-6">Address</Text>

      <TextInput
        className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        placeholder="House / Flat / Street"
        value={house}
        onChangeText={setHouse}
      />

      <TextInput
        className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        placeholder="Area / Locality"
        value={area}
        onChangeText={setArea}
      />

      <TextInput
        className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      {/* 🔥 MISSING FIELD FIXED */}
      <TextInput
        className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        placeholder="State"
        value={state}
        onChangeText={setState}
      />

      <TextInput
        className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
      />

      {/* GPS Section */}
      <Text className="text-lg font-semibold mt-6">GPS (Lat / Lon)</Text>

      <View className="flex-row justify-between">
        <TextInput
          placeholder="Latitude"
          value={latitude}
          editable={false}
          className="w-[48%] px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        />
        <TextInput
          placeholder="Longitude"
          value={longitude}
          editable={false}
          className="w-[48%] px-4 py-5 bg-dark-10 rounded-xl text-lg mb-3"
        />
      </View>

      <TouchableOpacity
        onPress={getLocation}
        className="bg-blue-600 p-3 mt-3 rounded mb-5"
      >
        {loadingLocation ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center">Get GPS Location</Text>
        )}
      </TouchableOpacity>

      {/* SAVE BUTTON */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={saving}
        className={`p-4 rounded-2xl ${
          saving ? "bg-green-400" : "bg-green-600"
        }`}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center text-xl font-bold">
            Save Profile
          </Text>
        )}
      </TouchableOpacity>

      {/* extra bottom spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
