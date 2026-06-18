import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CheckCircle2, Trash2 } from 'lucide-react-native';

interface ConfirmationModalProps {
  visible: boolean;
  type: 'done' | 'delete';
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmationModal({
  visible,
  type,
  taskTitle,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationModalProps) {
  const isDelete = type === 'delete';
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Logo */}
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={styles.title}>
            {isDelete ? 'Delete Task?' : 'Mark as Done?'}
          </Text>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {isDelete
              ? `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`
              : `Mark "${taskTitle}" as completed?`}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                isDelete ? styles.deleteButtonBg : styles.doneButtonBg,
              ]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={[styles.confirmButtonText, isDelete ? styles.deleteText : styles.doneText]}>
                {loading ? 'Processing...' : isDelete ? 'Delete' : 'Done'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  confirmButton: {
    // base style
  },
  doneButtonBg: {
    backgroundColor: '#22c55e',
  },
  deleteButtonBg: {
    backgroundColor: '#ef4444',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  doneText: {
    color: '#ffffff',
  },
  deleteText: {
    color: '#ffffff',
  },
});
