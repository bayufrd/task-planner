import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '../store/auth.store';

export default function Index() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (user && token) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
