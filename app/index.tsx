import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-white items-center justify-between py-12">
      <View className="px-8 mt-12 mb-5">
        <Text className="text-3xl font-bold text-center leading-10">
          Stop Food Waste, Start Saving Money
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <Image
          source={require('../assets/images/kitchen_pantry.png')}
          className="w-72 h-72"
          resizeMode="contain"
        />
      </View>

      <View className="w-4/5 items-center space-y-4 mb-10">
        <Link href="/register" asChild>
          <Pressable className="w-full py-4 rounded-xl bg-primary items-center mb-2">
            <Text className="text-dark-200 text-lg font-bold">Create Account</Text>
          </Pressable>
        </Link>

        <Link href="/login" asChild>
          <Pressable className="w-full py-4 rounded-xl bg-dark-10 border border-gray-300 items-center mb-2">
            <Text className="text-gray-700 text-lg font-bold">Continue with Email</Text>
          </Pressable>
        </Link>

        <Link href="/login" asChild>
          <Pressable className="w-full py-4 rounded-xl bg-dark-10 border border-gray-300 items-center">
            <Text className="text-gray-700 text-lg font-bold">Already have an account? Log In</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
