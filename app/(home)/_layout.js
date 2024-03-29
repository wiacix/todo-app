import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="addTask" />
      <Stack.Screen name="Loading" />
      <Stack.Screen name="DateTimePicker" />
      <Stack.Screen name="Picker" />
    </Stack>
  );
}