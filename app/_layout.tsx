import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="register"
        // Remove 'headerShown: false' to show the header and back button
        options={{ title: '' }} 
      />
      {/* Add other screens here as needed */}
      <Stack.Screen
        name="login"
        options={{ title: '' }}
      />
    </Stack>
  );
}