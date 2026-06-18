import { Stack } from "expo-router";
import { useAuthStore } from "../../store/auth.store";
import { Redirect } from "expo-router";

export default function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  console.log("[MainLayout] user:", user ? user.email : "null", "token:", token ? "exists" : "null");

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
