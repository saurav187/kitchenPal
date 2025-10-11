import { AntDesign } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function Register() {
  return (
    <View className="flex-1 bg-light items-center px-2">
      <Stack.Screen
        options={{
          title: '',
          headerShadowVisible: false,
          headerTintColor: 'black',
        }}
      />

      {/* Main Content Area - Centered Vertically */}
      <View className="flex-1 w-full max-w-sm items-center">
        {/* App Title */}
        <Text className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">
          SmartPantry
        </Text>

        {/* Input Fields Container */}
        <View className="w-[105%] space-y-4 mb-6">
          {/* Email */}
          <TextInput
            className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg placeholder:text-gray-500 mb-6"
            placeholder="Email"
            placeholderTextColor="#90a4ae"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <TextInput
            className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg placeholder:text-gray-500 mb-6"
            placeholder="Password"
            placeholderTextColor="#90A4AE"
            secureTextEntry
          />

          {/* Confirm Password */}
          <TextInput
            className="w-full px-4 py-5 bg-dark-10 rounded-xl text-lg placeholder:text-gray-500 mb-6"
            placeholder="Confirm Password"
            placeholderTextColor="#90A4AE"
            secureTextEntry
          />
        </View>

        {/* Buttons Container */}
        <View className="w-[105%] space-y-4 ">
          {/* Register Button */}
          <Pressable className="w-full py-4 bg-primary rounded-xl items-center active:bg-[#43A047] shadow-sm mb-4">
            <Text className="text-white text-lg font-bold tracking-wide">
              Register
            </Text>
          </Pressable>

          {/* Google Signup */}
          <Pressable className="w-full py-4 bg-dark-10 rounded-xl flex-row items-center justify-center active:bg-[#E8F5E9]">
            <AntDesign name="google" size={22} color="#374151" />
            <Text className="text-gray-800 text-lg font-bold ml-2">
              Sign up with Google
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Footer - fixed at the very bottom */}
      <View className="mb-8">
        <Link href="/login" asChild>
          <Pressable>
            <Text className="text-dark-100 text-base font-medium">
              Already have an account?{' '}
              <Text className="underline font-semibold">Sign in</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}