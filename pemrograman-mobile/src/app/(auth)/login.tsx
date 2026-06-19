import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  ActivityIndicator,
  Linking,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri, ResponseType } from "expo-auth-session";
import { useRouter } from "expo-router";
import { Hand, Info } from "lucide-react-native";
import { useAuthStore } from "../../store/auth.store";
import { authService } from "../../services/auth.service";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [isChecking, setIsChecking] = useState(true);
  const postLoginRoute = "/";

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "58234117934-qrbko87bnj96beh88dka59a36pe5fvro.apps.googleusercontent.com";
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "58234117934-83gobmutk6kble2jco0r3v4k2980ild2.apps.googleusercontent.com";
  const googleAuthRedirectUri = makeRedirectUri({
    native: "com.dastrevas.smarttaskplanner:/oauthredirect",
  });
  const googleConfig = useMemo(() => ({
    iosClientId: googleIosClientId,
    webClientId: googleWebClientId,
    redirectUri: googleAuthRedirectUri,
    responseType: ResponseType.IdToken,
    scopes: ["openid", "profile", "email"],
  }), [googleIosClientId, googleWebClientId, googleAuthRedirectUri]);
  const [googleRequest, googleResponse, promptGoogleAuth] = Google.useIdTokenAuthRequest(googleConfig);
  const describeGoogleResult = (result: any) => ({
    type: result?.type,
    paramKeys: result?.params ? Object.keys(result.params) : [],
    hasAuthentication: Boolean(result?.authentication),
    hasIdToken: Boolean(result?.authentication?.idToken || result?.params?.id_token),
    errorCode: result?.params?.error || result?.error?.code,
    errorName: result?.error?.name,
    errorMessage: result?.error?.message,
  });

  useEffect(() => {
    console.log("[Login][Google] Auth config", {
      platform: Platform.OS,
      hasWebClientId: Boolean(googleWebClientId),
      hasIosClientId: Boolean(googleIosClientId),
      redirectUri: googleAuthRedirectUri,
      responseType: ResponseType.IdToken,
      scopes: googleConfig.scopes,
      hasRequest: Boolean(googleRequest),
    });
  }, [googleWebClientId, googleIosClientId, googleAuthRedirectUri, googleConfig.scopes, googleRequest]);

  useEffect(() => {
    // Hydrate auth state on mount
    hydrate();
  }, []);

  useEffect(() => {
    console.log("[Login] useEffect - user:", user, "token:", token ? "exists" : "null", "isHydrated:", isHydrated);
    
    // Wait for hydration
    if (!isHydrated) {
      return;
    }
    
    // Clear any stale auth state on login screen
    if (!user && !token) {
      console.log("[Login] No user/token, showing login form");
      setIsChecking(false);
      return;
    }
    
    if (user && token) {
      console.log("[Login] Has user/token, showing login screen redirect via root index", {
        target: postLoginRoute,
        destination: "dashboard-root",
      });
      setIsChecking(false);
    } else {
      setIsChecking(false);
    }
  }, [user, token, isHydrated]);

  useEffect(() => {
    const syncGoogleLogin = async () => {
      if (googleResponse) {
        console.log("[Login][Google] Auth response observed", describeGoogleResult(googleResponse));
      }

      if (googleResponse?.type !== "success") {
        if (googleResponse?.type === "dismiss" || googleResponse?.type === "cancel") {
          console.log("[Login][Google] Auth flow stopped", describeGoogleResult(googleResponse));
          setIsGoogleSubmitting(false);
        }
        return;
      }

      try {
        const idToken = googleResponse.authentication?.idToken || (googleResponse as any).params?.id_token;

        console.log("[Login][Google] ID token check", {
          hasIdToken: Boolean(idToken),
          source: googleResponse.authentication?.idToken ? "authentication" : (googleResponse as any).params?.id_token ? "params" : "missing",
        });

        if (!idToken) {
          throw new Error("Google ID token tidak tersedia.");
        }

        console.log("[Login][Google] Backend exchange start", {
          endpoint: "/auth/google/mobile",
          hasIdToken: true,
        });

        const result = await authService.googleMobile({
          idToken,
          platform: Platform.OS,
        });

        console.log("[Login][Google] Backend exchange success", {
          hasUser: Boolean(result.user),
          hasToken: Boolean(result.token),
        });

        if (!result.token || !result.user) {
          throw new Error("Respons Google login tidak lengkap.");
        }

        await setAuth(result.user, result.token);
        console.log("[Login][Google] Navigation target before redirect", {
          target: postLoginRoute,
          destination: "dashboard-root",
        });
        try {
          router.replace(postLoginRoute);
          console.log("[Login][Google] Final post-login destination", {
            target: postLoginRoute,
            destination: "dashboard-root",
          });
        } catch (navigationError) {
          console.error("[Login][Google] Route resolution failure details", {
            target: postLoginRoute,
            destination: "dashboard-root",
            error: navigationError instanceof Error ? navigationError.message : navigationError,
          });
          throw navigationError;
        }
      } catch (e: any) {
        console.error("[Login][Google] Auth request fail", {
          message: e?.response?.data?.error?.message || e?.message || "Unknown Google login error",
          status: e?.response?.status,
          endpoint: "/auth/google/mobile",
          responseType: googleResponse?.type,
        });
        const message =
          e?.response?.data?.error?.message ||
          e?.message ||
          "Login Google gagal. Silakan coba lagi.";
        setError(message);
      } finally {
        setIsGoogleSubmitting(false);
      }
    };

    void syncGoogleLogin();
  }, [googleResponse, router, setAuth]);

  const handleEmailAuth = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    console.log("[Login][Email] Auth button press", {
      mode,
      hasName: Boolean(normalizedName),
      hasEmail: Boolean(normalizedEmail),
      hasPassword: Boolean(password),
      isHydrated,
    });

    if (mode === "register" && !normalizedName) {
      setError("Nama wajib diisi.");
      return;
    }

    if (!normalizedEmail || !password) {
      console.warn("[Login][Email] Submit blocked by missing fields", {
        mode,
        hasName: Boolean(normalizedName),
        hasEmail: Boolean(normalizedEmail),
        hasPassword: Boolean(password),
      });
      setError(mode === "register" ? "Nama, email, dan password wajib diisi." : "Email dan password wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    console.log("[Login][Email] Form submit start", {
      mode,
      hasName: Boolean(normalizedName),
      hasEmail: true,
      hasPassword: true,
      emailLength: normalizedEmail.length,
    });

    try {
      const result = mode === "register"
        ? await authService.register({
            name: normalizedName,
            email: normalizedEmail,
            password,
          })
        : await authService.login({
            email: normalizedEmail,
            password,
          });

      console.log("[Login][Email] Auth request success", {
        mode,
        endpoint: mode === "register" ? "/auth/register-client" : "/auth/login-client",
        hasUser: Boolean(result.user),
        hasToken: Boolean(result.token),
      });

      if (!result.token || !result.user) {
        throw new Error(mode === "register" ? "Respons register tidak lengkap." : "Respons login tidak lengkap.");
      }

      await setAuth(result.user, result.token);
      console.log("[Login][Email] Navigation target before redirect", {
        mode,
        target: postLoginRoute,
        destination: "dashboard-root",
      });

      setIsChecking(true);
      try {
        router.replace(postLoginRoute);
        console.log("[Login][Email] Final post-login destination", {
          mode,
          target: postLoginRoute,
          destination: "dashboard-root",
        });
      } catch (navigationError) {
        console.error("[Login][Email] Route resolution failure details", {
          mode,
          target: postLoginRoute,
          destination: "dashboard-root",
          error: navigationError instanceof Error ? navigationError.message : navigationError,
        });
        throw navigationError;
      }
    } catch (e: any) {
      console.error("[Login][Email] Auth request fail", {
        mode,
        message: e?.response?.data?.error?.message || e?.message || "Unknown auth error",
        status: e?.response?.status,
        target: postLoginRoute,
      });
      const message =
        e?.response?.data?.error?.message ||
        e?.message ||
        (mode === "register" ? "Register gagal. Silakan coba lagi." : "Login gagal. Silakan coba lagi.");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLink = async () => {
    const url = "https://taskplanner.dastrevas.com";
    await Linking.openURL(url);
  };

  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleSubmitting(true);

    console.log("[Login][Google] Login button press", {
      platform: Platform.OS,
      hasRequest: Boolean(googleRequest),
      hasWebClientId: Boolean(googleWebClientId),
      hasIosClientId: Boolean(googleIosClientId),
      redirectUri: googleAuthRedirectUri,
      responseType: ResponseType.IdToken,
    });

    try {
      const result = await promptGoogleAuth();
      console.log("[Login][Google] Prompt result", describeGoogleResult(result));

      if (result.type !== "success") {
        setIsGoogleSubmitting(false);
      }
    } catch (e: any) {
      console.error("[Login][Google] Prompt failed", {
        message: e?.message || "Unknown prompt error",
        name: e?.name,
      });
      setIsGoogleSubmitting(false);
      setError(e?.message || "Login Google gagal. Silakan coba lagi.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/icon.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>Smart Task Planner</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitle}>{mode === "login" ? "Welcome Back!" : "Create Account"}</Text>
            <Hand size={22} color="#3b82f6" strokeWidth={2.2} />
          </View>
          <Text style={styles.heroSubtitle}>
            {mode === "login"
              ? "Masuk untuk lanjut mengelola tugas harianmu."
              : "Daftar cepat untuk mulai pakai Task Planner dari mobile."}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Info size={18} color="#3b82f6" strokeWidth={2.2} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Butuh penjelasan lengkap app?</Text>
            <Text style={styles.infoText}>Tekan Open link untuk baca versi lengkap di website resmi.</Text>
          </View>
          <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink} activeOpacity={0.8}>
            <Text style={styles.linkButtonText}>Open link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modeSwitch}>
          <TouchableOpacity
            style={[styles.modeButton, mode === "login" && styles.modeButtonActive]}
            onPress={() => {
              setMode("login");
              setError(null);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeButtonText, mode === "login" && styles.modeButtonTextActive]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === "register" && styles.modeButtonActive]}
            onPress={() => {
              setMode("register");
              setError(null);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeButtonText, mode === "register" && styles.modeButtonTextActive]}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {mode === "register" ? (
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (error) setError(null);
              }}
            />
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(null);
            }}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Login Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleEmailAuth}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>{mode === "login" ? "Login with Email" : "Register with Email"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, isGoogleSubmitting && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
            disabled={isGoogleSubmitting}
          >
            <View style={styles.googleIcon}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </Svg>
            </View>
            {isGoogleSubmitting ? (
              <ActivityIndicator color="#334155" size="small" />
            ) : (
              <Text style={styles.secondaryButtonText}>Continue with Google</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  linkButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  linkButtonText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '600',
  },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: -4,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  googleIcon: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
