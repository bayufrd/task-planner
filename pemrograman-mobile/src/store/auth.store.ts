import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggingOut: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggingOut: false,
      setAuth: (user, token) => {
        set({ user, token });
      },
      clearAuth: () => {
        set({ user: null, token: null, isLoggingOut: false });
      },
      logout: async () => {
        console.log("[AuthStore] logout called");
        // Mark as logging out immediately
        set({ isLoggingOut: true });
        
        try {
          // Clear ALL AsyncStorage keys first
          const keys = await AsyncStorage.getAllKeys();
          console.log("[AuthStore] Keys in storage:", keys);
          if (keys.length > 0) {
            await AsyncStorage.multiRemove(keys);
            console.log("[AuthStore] Cleared all keys");
          }
        } catch (e) {
          console.error("Error clearing AsyncStorage:", e);
        }
        
        // Clear state without persist (use raw set)
        set({ user: null, token: null, isLoggingOut: false });
        console.log("[AuthStore] State cleared - user: null, token: null, isLoggingOut: false");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token
      }),
    }
  )
);
