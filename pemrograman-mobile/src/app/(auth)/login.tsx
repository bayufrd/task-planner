import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import WebViewAuth from "../../components/WebViewAuth";
import { useAuthStore } from "../../store/auth.store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already logged in
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("auth-token");
      const userStr = await AsyncStorage.getItem("user");
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setAuth(user, token);
        setIsAuthenticated(true);
        router.replace("/(main)/dashboard");
      }
    } catch (e) {
      console.error("Error checking auth:", e);
    }
  };

  const handleSuccess = async (token: string, user: any) => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem("auth-token", token);
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      }
      
      // Update auth store
      setAuth(user, token);
      
      // Navigate to dashboard
      router.replace("/(main)/dashboard");
    } catch (e) {
      console.error("Error saving auth:", e);
      Alert.alert("Error", "Failed to save login data");
    }
  };

  const handleError = (error: string) => {
    console.error("WebView auth error:", error);
    Alert.alert("Login Failed", error);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Task Planner</Text>
        <Text style={styles.subtitle}>Login to continue</Text>
      </View>
      
      <WebViewAuth onSuccess={handleSuccess} onError={handleError} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
});
