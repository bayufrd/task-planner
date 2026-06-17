import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WebViewAuthProps {
  onSuccess: (token: string, user: any) => void;
  onError?: (error: string) => void;
}

const WEB_URL = 'https://taskplanner.dastrevas.com';
const AUTH_TOKEN_KEY = 'auth-token';
const AUTH_USER_KEY = 'backendUser';

export default function WebViewAuth({ onSuccess, onError }: WebViewAuthProps) {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear any existing session in WebView first
  const clearWebViewData = `
    (function() {
      localStorage.removeItem('${AUTH_TOKEN_KEY}');
      localStorage.removeItem('${AUTH_USER_KEY}');
      localStorage.removeItem('next-auth.session-token');
      localStorage.removeItem('__Secure-next-auth.session-token');
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    })();
    true;
  `;

  // Inject script to extract token after login
  const extractTokenScript = `
    (function() {
      var token = localStorage.getItem('${AUTH_TOKEN_KEY}');
      var userStr = localStorage.getItem('${AUTH_USER_KEY}');
      var user = userStr ? JSON.parse(userStr) : null;
      
      if (token) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'AUTH_TOKEN',
          token: token,
          user: user
        }));
      }
    })();
    true;
  `;

  // Check if logged in periodically
  const checkAuthScript = `
    (function() {
      var token = localStorage.getItem('${AUTH_TOKEN_KEY}');
      var userStr = localStorage.getItem('${AUTH_USER_KEY}');
      
      if (token) {
        try {
          var user = userStr ? JSON.parse(userStr) : null;
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'AUTH_TOKEN',
            token: token,
            user: user
          }));
        } catch(e) {
          console.error('Parse error', e);
        }
      }
    })();
    true;
  `;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'AUTH_TOKEN' && data.token) {
        // Save token to AsyncStorage
        await AsyncStorage.setItem('auth-token', data.token);
        if (data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Notify parent
        onSuccess(data.token, data.user);
      }
    } catch (e) {
      console.error('Message parse error:', e);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    // Check auth after any navigation
    if (webViewRef.current && !navState.loading) {
      setTimeout(() => {
        webViewRef.current?.injectJavaScript(checkAuthScript);
      }, 500);
    }
  };

  const handleWebViewError = () => {
    setError('Failed to load login page. Please check your internet connection.');
    setLoading(false);
    onError?.('WebView failed to load');
  };

  const handleReload = () => {
    setError(null);
    setLoading(true);
    webViewRef.current?.reload();
  };

  // Inject clear script on load
  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setLoading(false);
    // Clear existing session
    webViewRef.current?.injectJavaScript(clearWebViewData);
    // Check if already logged in
    setTimeout(() => {
      webViewRef.current?.injectJavaScript(checkAuthScript);
    }, 1000);
  };

  const injectedJS = `
    (function() {
      // Listen for storage events (for when login completes)
      window.addEventListener('storage', function(e) {
        if (e.key === '${AUTH_TOKEN_KEY}' && e.newValue) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'AUTH_TOKEN',
            token: e.newValue
          }));
        }
      });
      
      // Also check on any page change
      var originalPushState = history.pushState;
      history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAGE_CHANGED' }));
        }, 500);
      };
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading login page...</Text>
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
        injectedJavaScript={injectedJS}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
        startInLoadingState
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )}
      />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You will be redirected to the web login page.{'\n'}
          Your credentials are secured.
        </Text>
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
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
