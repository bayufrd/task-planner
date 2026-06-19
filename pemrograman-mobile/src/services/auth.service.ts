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

    if (normalized.refreshToken) {
      await AsyncStorage.setItem("auth-refresh-token", normalized.refreshToken);
    }

    if (normalized.sessionId) {
      await AsyncStorage.setItem("auth-session-id", normalized.sessionId);
    }

    return normalized;
  },
  register: async (data: ClientAuthPayload & { name: string }) => {
    const response = await api.post<AuthResponse>("/auth/register-client", buildClientPayload(data));
    const normalized = normalizeAuthResponse(response.data);

    if (normalized.token) {
      await AsyncStorage.setItem("auth-token", normalized.token);
    }

    if (normalized.refreshToken) {
      await AsyncStorage.setItem("auth-refresh-token", normalized.refreshToken);
    }

    if (normalized.sessionId) {
      await AsyncStorage.setItem("auth-session-id", normalized.sessionId);
    }

    return normalized;
  },
  refresh: async () => {
    const refreshToken = await AsyncStorage.getItem("auth-refresh-token");

    if (!refreshToken) {
      return null;
    }

    const response = await api.post<AuthResponse>("/auth/refresh", buildClientPayload({
      email: "",
      password: "",
      refreshToken,
    } as ClientAuthPayload & { refreshToken: string }));
    const normalized = normalizeAuthResponse(response.data);

    if (normalized.token) {
      await AsyncStorage.setItem("auth-token", normalized.token);
    }

    if (normalized.refreshToken) {
      await AsyncStorage.setItem("auth-refresh-token", normalized.refreshToken);
    }

    if (normalized.sessionId) {
      await AsyncStorage.setItem("auth-session-id", normalized.sessionId);
    }

    return normalized;
  },
  logout: async () => {
    await AsyncStorage.multiRemove(["auth-token", "auth-refresh-token", "auth-session-id"]);
  },
  getProfile: async () => {
    const response = await api.get<AuthResponse>("/auth/me");
    return normalizeAuthResponse(response.data).user;
  },
};
