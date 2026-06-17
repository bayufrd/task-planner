import api from "./api";
import { AuthResponse, User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  login: async (data: any) => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    if (response.data.token) {
      await AsyncStorage.setItem("auth-token", response.data.token);
    }
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem("auth-token");
  },
  getProfile: async () => {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },
};
