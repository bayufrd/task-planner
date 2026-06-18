import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, Edit3, Check, Trash2, Clock, Calendar, Zap, Timer, Tag } from 'lucide-react-native';

interface TaskDetailModalProps {
  visible: boolean;
  task: {
    id: string;
    title: string;
    description?: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
    deadline?: string;
    estimatedDuration?: number;
    status?: string;
    tags?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  } | null;
  onClose: () => void;
  onEdit: () => void;
  onDone: () => void;
  onDelete: () => void;
}

const priorityColors = {
  HIGH: '#ef4444',
  MEDIUM: '#f59e0b',
  LOW: '#22c55e',
};

const priorityLabels = {
  HIGH: 'High Priority',
  MEDIUM: 'Medium Priority',
  LOW: 'Low Priority',
};

const statusColors = {
  TODO: '#64748b',
  IN_PROGRESS: '#3b82f6',
  DONE: '#22c55e',
};

export default function TaskDetailModal({
  visible,
  task,
  onClose,
  onEdit,
  onDone,
  onDelete,
}: TaskDetailModalProps) {
  if (!task) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DONE': return 'Done';
      default: return status || 'Unknown';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Task Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.title}>{task.title}</Text>

            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: (statusColors[task.status as keyof typeof statusColors] || '#64748b') + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColors[task.status as keyof typeof statusColors] || '#64748b' }]} />
              <Text style={[styles.statusText, { color: statusColors[task.status as keyof typeof statusColors] || '#64748b' }]}>
                {getStatusLabel(task.status)}
              </Text>
            </View>

            {/* Priority */}
            {task.priority && (
              <View style={styles.infoRow}>
                <View style={[styles.iconContainer, { backgroundColor: priorityColors[task.priority] + '20' }]}>
                  <Zap size={16} color={priorityColors[task.priority]} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Priority</Text>
                  <Text style={[styles.infoValue, { color: priorityColors[task.priority] }]}>
                    {priorityLabels[task.priority]}
                  </Text>
                </View>
              </View>
            )}

            {/* Deadline */}
            {task.deadline && (
              <View style={styles.infoRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#3b82f620' }]}>
                  <Calendar size={16} color="#3b82f6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Due Date</Text>
                  <Text style={styles.infoValue}>{formatDate(task.deadline)}</Text>
                </View>
              </View>
            )}

            {/* Time */}
            {task.deadline && (
              <View style={styles.infoRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#8b5cf620' }]}>
                  <Clock size={16} color="#8b5cf6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Due Time</Text>
                  <Text style={styles.infoValue}>{formatTime(task.deadline)}</Text>
                </View>
              </View>
            )}

            {/* Duration */}
            {task.estimatedDuration && (
              <View style={styles.infoRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#f59e0b20' }]}>
                  <Timer size={16} color="#f59e0b" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Estimated Duration</Text>
                  <Text style={styles.infoValue}>{formatDuration(task.estimatedDuration)}</Text>
                </View>
              </View>
            )}

            {/* Difficulty */}
            {task.difficulty && (
              <View style={styles.infoRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#64748b20' }]}>
                  <Zap size={16} color="#64748b" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Difficulty</Text>
                  <Text style={styles.infoValue}>
                    {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                  </Text>
                </View>
              </View>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <View style={styles.tagsSection}>
                <View style={styles.infoRow}>
                  <View style={[styles.iconContainer, { backgroundColor: '#22c55e20' }]}>
                    <Tag size={16} color="#22c55e" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Tags</Text>
                  </View>
                </View>
                <View style={styles.tagsContainer}>
                  {task.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Description */}
            {task.description && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{task.description}</Text>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Edit3 size={18} color="#3b82f6" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneButton} onPress={onDone}>
              <Check size={18} color="#ffffff" />
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Trash2 size={18} color="#ef4444" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    lineHeight: 28,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginLeft: 48,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  descriptionSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    flex: 1,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
    marginLeft: 8,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    flex: 1,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
