import { AntDesign } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 🟢 added error state
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      let message = "Login failed. Please try again.";
      if (err.code === "auth/invalid-email") message = "Invalid email format.";
      else if (err.code === "auth/user-not-found") message = "User not found.";
      else if (err.code === "auth/wrong-password") message = "Incorrect password.";
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* 🟠 Inline error message */}
        {error ? (
          <Text className="text-red-500 text-base mb-4 text-center">{error}</Text>
        ) : null}

        <Pressable
          onPress={handleLogin}
          className="w-full py-4 bg-primary rounded-xl items-center mb-4"
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        <Pressable className="w-full py-4 bg-dark-10 rounded-xl flex-row items-center justify-center">
          <AntDesign name="google" size={22} color="#374151" />
          <Text className="text-gray-800 text-lg font-bold ml-2">
            Continue with Google
          </Text>
        </Pressable>
      </View>

      <View className="mb-8">
        <Link href="/register" asChild>
          <Pressable>
            <Text className="text-dark-100 text-base font-medium">
              Don’t have an account?{" "}
              <Text className="underline font-semibold">Sign Up</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
