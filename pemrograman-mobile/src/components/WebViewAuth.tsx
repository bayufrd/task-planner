import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WebViewAuthProps {
  onSuccess: (token: string, user: any) => void;
  onError?: (error: string) => void;
}

const WEB_URL = 'https://taskplanner.dastrevas.com';

export default function WebViewAuth({ onSuccess, onError }: WebViewAuthProps) {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pendingTokenRef = useRef<string | null>(null);
  const pendingUserRef = useRef<any>(null);

  // Clear storage only once per WebView session; clearing on every navigation logs the user out mid-login.
  const clearStorageScript = `
    (function() {
      if (!window.__RN_WEBVIEW_AUTH_CLEARED__) {
        window.__RN_WEBVIEW_AUTH_CLEARED__ = true;

        localStorage.removeItem('auth-token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('backendUser');
        localStorage.removeItem('user');
        localStorage.removeItem('auth-storage');

        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        console.log('Cleared WebView localStorage and cookies');
      }
    })();
    true;
  `;

  // Extract token script
  const extractTokenScript = `
    (function() {
      var token = localStorage.getItem('auth-token') || localStorage.getItem('authToken');
      var userStr = localStorage.getItem('backendUser') || localStorage.getItem('user');
      var user = null;
      try { user = userStr ? JSON.parse(userStr) : null; } catch(e) {}
      
      if (token) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'AUTH_SUCCESS',
          token: token,
          user: user
        }));
      }
    })();
    true;
  `;

  // Script to override localStorage.setItem
  const storageOverrideScript = `
    (function() {
      var originalSetItem = localStorage.setItem.bind(localStorage);
      localStorage.setItem = function(key, value) {
        if (key === 'auth-token' || key === 'authToken') {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'AUTH_TOKEN_SAVED',
            token: value
          }));
        }
        if (key === 'backendUser' || key === 'user') {
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'AUTH_USER_SAVED',
              user: JSON.parse(value)
            }));
          } catch(e) {}
        }
        return originalSetItem(key, value);
      };
    })();
    true;
  `;

  // Combined injection script - clear first, then override, then extract
  const injectedJS = clearStorageScript + ';\n' + storageOverrideScript + ';\n' + extractTokenScript;

  // Clear stale AsyncStorage on mount
  React.useEffect(() => {
    const clearStaleStorage = async () => {
      try {
        await AsyncStorage.multiRemove(['auth-token', 'auth-user', 'user']);
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
    };
    clearStaleStorage();
  }, []);

  const handleMessage = useCallback(async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('[WebViewAuth] message:', data.type, {
        hasToken: Boolean(data.token),
        hasUser: Boolean(data.user),
      });

      if (data.type === 'AUTH_USER_SAVED' && data.user) {
        pendingUserRef.current = data.user;

        if (pendingTokenRef.current) {
          await AsyncStorage.setItem('auth-user', JSON.stringify(data.user));
          await AsyncStorage.setItem('auth-token', pendingTokenRef.current);
          onSuccess(pendingTokenRef.current, data.user);
        }
        return;
      }
      
      if ((data.type === 'AUTH_SUCCESS' || data.type === 'AUTH_TOKEN_SAVED') && data.token) {
        pendingTokenRef.current = data.token;

        const user = data.user || pendingUserRef.current;
        if (!user) {
          console.log('[WebViewAuth] token received before user payload');
          return;
        }

        await AsyncStorage.setItem('auth-token', data.token);
        await AsyncStorage.setItem('auth-user', JSON.stringify(user));
        onSuccess(data.token, user);
      }
    } catch (e) {
      console.error('Message parse error:', e);
    }
  }, [onSuccess]);

  // Intercept navigation requests
  const shouldStartLoadWithRequest = useCallback((request: any) => {
    const { url } = request;
    console.log('[WebViewAuth] request:', url);
    
    if (url.includes('/dashboard') || url.includes('/overview')) {
      setTimeout(() => {
        webViewRef.current?.injectJavaScript(extractTokenScript);
      }, 1500);
    }
    
    return true;
  }, []);

  const handleNavigationStateChange = useCallback((navState: any) => {
    const { url, loading } = navState;
    console.log('[WebViewAuth] nav:', { url, loading });
    
    if (!loading && url && (url.includes('/dashboard') || url.includes('/overview'))) {
      setTimeout(() => {
        webViewRef.current?.injectJavaScript(extractTokenScript);
      }, 1000);
    }
  }, []);

  const handleWebViewError = useCallback((event?: any) => {
    console.error('[WebViewAuth] load error:', event?.nativeEvent);
    setError('Failed to load login page. Check internet connection.');
    setLoading(false);
  }, []);

  const handleReload = useCallback(() => {
    setError(null);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ uri: `${WEB_URL}/auth/signin` }}
        style={styles.webview}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleWebViewError}
        onHttpError={handleWebViewError}
        onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
        injectedJavaScript={injectedJS}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
        startInLoadingState
        cacheEnabled={false}
        incognito={true}
        sharedCookiesEnabled={false}
      />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Secure authentication</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 10,
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
