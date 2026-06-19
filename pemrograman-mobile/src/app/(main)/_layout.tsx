import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../store/auth.store";
import { useEffect } from "react";
import CommandPaletteLauncher from "../../components/command-palette/CommandPaletteLauncher";
import GlobalCommandPalette from "../../components/command-palette/GlobalCommandPalette";
import { CommandPaletteProvider } from "../../components/command-palette/CommandPaletteProvider";
import { notificationService } from "../../notifications/notification.service";

export default function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    // Hydrate auth state
    const hydrate = useAuthStore.getState().hydrate;
    hydrate();
  }, []);

  useEffect(() => {
    void notificationService.registerForPushNotificationsAsync();
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
    <CommandPaletteProvider>
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
      <CommandPaletteLauncher />
      <GlobalCommandPalette />
    </CommandPaletteProvider>
  );
}
