import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

// Since WebView cannot load external scripts reliably in Expo Go,
// we'll use a simplified verification approach for development
// In production, this should be replaced with actual Turnstile integration

export default function Turnstile({ onVerify, onError }: TurnstileProps) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    // Generate a pseudo-token for development
    // In production, this should be replaced with actual CAPTCHA verification
    setTimeout(() => {
      const token = `dev_token_${Date.now()}`;
      setVerified(true);
      setLoading(false);
      onVerify(token);
    }, 1000);
  };

  const handleReset = () => {
    setVerified(false);
    onError?.();
  };

  if (verified) {
    return (
      <View style={[styles.container, styles.verifiedContainer]}>
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.verifiedText}>Verified</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Verify I'm not a robot</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.note}>
        This is a development placeholder.{'\n'}
        Production will use real CAPTCHA.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  verifiedContainer: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
  },
  resetText: {
    fontSize: 12,
    color: '#16a34a',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  note: {
    marginTop: 8,
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
