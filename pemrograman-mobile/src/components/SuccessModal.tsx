import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

export default function SuccessModal({
  visible,
  title,
  message,
  onClose,
  autoCloseDelay = 2000,
}: SuccessModalProps) {
  useEffect(() => {
    if (visible && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [visible, autoCloseDelay, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Logo Icon */}
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          {/* Checkmark */}
          <View style={styles.checkContainer}>
            <CheckCircle2 size={48} color="#22c55e" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  checkContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
