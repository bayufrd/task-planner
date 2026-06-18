import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
      },
      logout: async () => {
        // Clear both storage locations
        await AsyncStorage.multiRemove(["auth-storage", "auth-token"]);
        // Then clear state
        set({ user: null, token: null });
      },
      initAuth: async () => {
        // Persist middleware handles loading from storage
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
