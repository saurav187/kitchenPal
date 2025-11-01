import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      {/* Header */}
      <Text className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        My Pantry
      </Text>

      {/* Hero Image */}
      <Image
        source={require("../../assets/images/kitchen_pantry1.png")}
        className="w-full h-100 rounded-2xl mb-8"
        resizeMode="cover"
      />

      {/* Welcome Text */}
      <Text className="text-xl font-semibold text-gray-800 mb-3">
        Welcome to your Smart Pantry!
      </Text>
      <Text className="text-gray-600 mb-10 leading-6">
        Let’s get started. Add your first item to track expiry dates and reduce
        food waste.
      </Text>

      {/* Button */}
      <Pressable
        onPress={() => router.push("/(tabs)/addItem")}
        className="bg-[#4CAF50] py-4 rounded-xl items-center shadow-md active:bg-[#43A047]"
      >
        <Text className="text-white text-lg font-bold">Add Your First Item</Text>
      </Pressable>
    </View>
  );
}
