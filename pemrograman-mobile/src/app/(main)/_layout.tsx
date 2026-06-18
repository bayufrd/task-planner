import { Stack } from "expo-router";
import { useAuthStore } from "../../store/auth.store";
import { useEffect } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    // Hydrate auth state
    const hydrate = useAuthStore.getState().hydrate;
    hydrate();
  }, []);

  console.log("[MainLayout] user:", user ? user.email : "null", "token:", token ? "exists" : "null", "isHydrated:", isHydrated);

  // Wait for hydration before checking auth
  if (!isHydrated) {
    return null; // Or a loading spinner
  }

  // Redirect to login if not authenticated
  if (!user || !token) {
    console.log("[MainLayout] No auth, redirecting to login");
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
