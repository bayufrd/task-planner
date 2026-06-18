import { Stack } from "expo-router";
import { useAuthStore } from "../../store/auth.store";
import { useEffect } from "react";
import { Redirect } from "expo-router";

export default function MainLayout() {
  const user = useAuthStore((state) => state.user);

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="new-task"
        options={{
          headerShown: false,
          presentation: 'modal'
        }}
      />
    </Stack>
  );
}
