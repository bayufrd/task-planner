import api from "./api";
import { AuthResponse, AuthResponseData, ClientAuthPayload, User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const normalizeAuthResponse = (payload: AuthResponse): AuthResponseData => {
  const normalized = payload.data ?? payload;

  return {
    user: normalized.user as User,
    token: normalized.token as string,
    refreshToken: normalized.refreshToken,
    tokenType: normalized.tokenType,
    expiresIn: normalized.expiresIn,
    sessionId: normalized.sessionId,
    authContext: normalized.authContext,
    provider: normalized.provider,
  };
};

const buildClientPayload = (data: ClientAuthPayload): ClientAuthPayload => ({
  clientType: "mobile",
  platform: Platform.OS,
  ...data,
});

export const authService = {
  login: async (data: ClientAuthPayload) => {
    const response = await api.post<AuthResponse>("/auth/login-client", buildClientPayload(data));
    const normalized = normalizeAuthResponse(response.data);

    if (normalized.token) {
      await AsyncStorage.setItem("auth-token", normalized.token);
    }

    return normalized;
  },
  register: async (data: ClientAuthPayload & { name: string }) => {
    const response = await api.post<AuthResponse>("/auth/register-client", buildClientPayload(data));
    const normalized = normalizeAuthResponse(response.data);

    if (normalized.token) {
      await AsyncStorage.setItem("auth-token", normalized.token);
    }

    return normalized;
  },
  logout: async () => {
    await AsyncStorage.removeItem("auth-token");
  },
  getProfile: async () => {
    const response = await api.get<AuthResponse>("/auth/me");
    return normalizeAuthResponse(response.data).user;
  },
};
