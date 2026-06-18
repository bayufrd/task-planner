import { create } from "zustand";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggingOut: boolean;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoggingOut: false,
  isHydrated: false,

  hydrate: async () => {
    try {
      const userStr = await AsyncStorage.getItem("auth-user");
      const token = await AsyncStorage.getItem("auth-token");
      if (userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isHydrated: true });
        console.log("[AuthStore] Hydrated - user:", user.email);
      } else {
        set({ isHydrated: true });
      }
    } catch (e) {
      console.error("[AuthStore] Hydrate error:", e);
      set({ isHydrated: true });
    }
  },

  setAuth: async (user, token) => {
    try {
      await AsyncStorage.setItem("auth-user", JSON.stringify(user));
      await AsyncStorage.setItem("auth-token", token);
      set({ user, token });
      console.log("[AuthStore] Auth saved - user:", user.email);
    } catch (e) {
      console.error("[AuthStore] setAuth error:", e);
    }
  },

  logout: async () => {
    console.log("[AuthStore] logout called");
    set({ isLoggingOut: true });
    
    // Clear state FIRST
    set({ user: null, token: null, isLoggingOut: false });
    console.log("[AuthStore] State cleared in memory");
    
    // Then clear AsyncStorage
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log("[AuthStore] Keys in storage:", keys);
      if (keys.length > 0) {
        await AsyncStorage.multiRemove(keys);
        console.log("[AuthStore] Cleared all AsyncStorage keys");
      }
    } catch (e) {
      console.error("[AuthStore] Error clearing AsyncStorage:", e);
    }
  },
}));
