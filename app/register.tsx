import { AntDesign } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(""); // 🟢 added error state
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!email || !password || !confirm) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/login");
    } catch (err: any) {
      let message = "Registration failed. Please try again.";
      if (err.code === "auth/email-already-in-use")
        message = "This email is already registered.";
      else if (err.code === "auth/invalid-email")
        message = "Invalid email format.";
      else if (err.code === "auth/weak-password")
        message = "Weak password. Try a stronger one.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-light items-center px-2">
      <Stack.Screen options={{ title: "", headerShadowVisible: false }} />
      <View className="flex-1 w-full max-w-sm items-center">
        <Text className="text-4xl font-extrabold text-gray-800 mb-10">
          Kitchen Pal
        </Text>

        <View className="w-[105%] space-y-4 mb-6">
          <TextInput
            className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-6"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg mb-6"
            placeholder="Confirm Password"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
        </View>

        {/* 🟠 Inline error message */}
        {error ? (
          <Text className="text-red-500 text-base mb-4 text-center">{error}</Text>
        ) : null}

        <Pressable
          onPress={handleRegister}
          className="w-full py-4 bg-primary rounded-xl items-center mb-4"
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? "Creating..." : "Register"}
          </Text>
        </Pressable>

        <Pressable className="w-full py-4 bg-dark-10 rounded-xl flex-row items-center justify-center">
          <AntDesign name="google" size={22} color="#374151" />
          <Text className="text-gray-800 text-lg font-bold ml-2">
            Sign up with Google
          </Text>
        </Pressable>
      </View>

      <View className="mb-8">
        <Link href="/login" asChild>
          <Pressable>
            <Text className="text-dark-100 text-base font-medium">
              Already have an account?{" "}
              <Text className="underline font-semibold">Sign in</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
