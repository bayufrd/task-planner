import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../services/task.service";
import { ChevronLeft, ChevronRight, Check, X, Calendar, Clock, Zap, Timer, FileText, Target, Edit3 } from "lucide-react-native";
import SuccessModal from "../../components/SuccessModal";

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type TaskStep = 'title' | 'description' | 'date' | 'time' | 'priority' | 'duration' | 'review';

const TASK_STEPS: Array<{ key: TaskStep; label: string; helper: string }> = [
  { key: 'title', label: 'Task Title', helper: 'Start with the main task name.' },
  { key: 'description', label: 'Description', helper: 'Optional details for extra context.' },
  { key: 'date', label: 'Date', helper: 'Pick when this task should happen.' },
  { key: 'time', label: 'Time', helper: 'Choose a comfortable time slot.' },
  { key: 'priority', label: 'Priority', helper: 'Set how urgent this task feels.' },
  { key: 'duration', label: 'Duration', helper: 'Estimate how long it should take.' },
  { key: 'review', label: 'Review', helper: 'Check the details before creating.' },
];

const priorityOptions: Array<{ value: Priority; label: string; hint: string; color: string; bgColor: string }> = [
  { value: 'HIGH', label: 'High', hint: 'Urgent and needs attention soon.', color: '#ef4444', bgColor: '#fef2f2' },
  { value: 'MEDIUM', label: 'Medium', hint: 'Important but not the most urgent.', color: '#f97316', bgColor: '#fff7ed' },
  { value: 'LOW', label: 'Low', hint: 'Can wait until higher priorities are done.', color: '#22c55e', bgColor: '#f0fdf4' },
];

const getCurrentDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localNow = new Date(now.getTime() - offset * 60 * 1000);
  return {
    date: localNow.toISOString().slice(0, 10),
    time: localNow.toISOString().slice(11, 16),
  };
};

export default function NewTaskScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string | undefined;
  const isEditMode = !!taskId;
  const defaultDateTime = getCurrentDateTime();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [deadline, setDeadline] = useState(defaultDateTime.date);
  const [deadlineTime, setDeadlineTime] = useState(defaultDateTime.time);
  const [estimatedDuration, setEstimatedDuration] = useState('60');
  const [currentStep, setCurrentStep] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timeInputMode, setTimeInputMode] = useState<'select' | 'manual'>('select');
  const [manualTime, setManualTime] = useState('');
  const [isLoadingTask, setIsLoadingTask] = useState(isEditMode);

  // Load task data when editing
  useEffect(() => {
    if (isEditMode && taskId) {
      taskService.getTask(taskId).then((task) => {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setPriority((task.priority as Priority) || 'MEDIUM');
        if (task.deadline) {
          const d = new Date(task.deadline);
          setDeadline(d.toISOString().slice(0, 10));
          setDeadlineTime(d.toISOString().slice(11, 16));
        }
        setEstimatedDuration(String(task.estimatedDuration || 60));
        setIsLoadingTask(false);
      }).catch(() => {
        setIsLoadingTask(false);
      });
    }
  }, [isEditMode, taskId]);

  const currentConfig = TASK_STEPS[currentStep];
  const isLastStep = currentStep === TASK_STEPS.length - 1;

  const canContinue = useMemo(() => {
    switch (TASK_STEPS[currentStep].key) {
      case 'title':
        return title.trim().length > 0;
      case 'duration':
        return (parseInt(estimatedDuration, 10) || 0) >= 5;
      case 'time':
        if (timeInputMode === 'manual') {
          // Validate HH:MM format
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return timeRegex.test(manualTime);
        }
        return true;
      default:
        return true;
    }
  }, [currentStep, estimatedDuration, title, timeInputMode, manualTime]);

  const nextLabel = isLastStep ? (isEditMode ? 'Update Task' : 'Create Task') : 'Continue';

  const goNext = () => {
    if (!canContinue) {
      if (TASK_STEPS[currentStep].key === 'title') {
        Alert.alert('Error', 'Please enter a task title');
      } else if (TASK_STEPS[currentStep].key === 'duration') {
        Alert.alert('Error', 'Duration must be at least 5 minutes');
      } else if (TASK_STEPS[currentStep].key === 'time' && timeInputMode === 'manual') {
        Alert.alert('Error', 'Please enter time in HH:MM format (e.g., 14:30)');
      }
      return;
    }
    // If manual time mode, use manualTime value
    if (TASK_STEPS[currentStep].key === 'time' && timeInputMode === 'manual' && manualTime) {
      setDeadlineTime(manualTime);
    }
    setCurrentStep((step) => Math.min(step + 1, TASK_STEPS.length - 1));
  };

  const goBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const taskMutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditMode && taskId) {
        return taskService.updateTask(taskId, data);
      }
      return taskService.createTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
      setShowSuccessModal(true);
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.message || `Failed to ${isEditMode ? 'update' : 'create'} task`);
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    if ((parseInt(estimatedDuration, 10) || 0) < 5) {
      Alert.alert('Error', 'Duration must be at least 5 minutes');
      return;
    }

    taskMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      deadline: new Date(`${deadline}T${deadlineTime}:00`).toISOString(),
      estimatedDuration: parseInt(estimatedDuration, 10) || 60,
    });
  };

  // Generate date options (next 30 days)
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      dates.push({
        value: `${yyyy}-${mm}-${dd}`,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      });
    }
    return dates;
  }, []);

  // Generate time options
  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = String(h).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        const label = `${hour}:${minute}`;
        const display = new Date(`2000-01-01T${label}:00`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        times.push({ value: label, label: display });
      }
    }
    return times;
  }, []);

  const adjustDuration = (amount: number) => {
    const newVal = Math.max(5, (parseInt(estimatedDuration, 10) || 0) + amount);
    setEstimatedDuration(String(newVal));
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderStepContent = () => {
    switch (currentConfig.key) {
      case 'title':
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="What needs to be done?"
                placeholderTextColor="#94a3b8"
                autoFocus
              />
            </View>
          </View>
        );

      case 'description':
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.titleInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add more details (optional)"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );

      case 'date':
        return (
          <View style={styles.stepContent}>
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {dateOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionItem, deadline === option.value && styles.optionItemSelected]}
                  onPress={() => {
                    setDeadline(option.value);
                    goNext();
                  }}
                >
                  <Text style={[styles.optionText, deadline === option.value && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                  {deadline === option.value && <Check size={20} color="#3b82f6" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 'time':
        return (
          <View style={styles.stepContent}>
            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeToggleButton, timeInputMode === 'select' && styles.modeToggleActive]}
                onPress={() => setTimeInputMode('select')}
              >
                <Clock size={16} color={timeInputMode === 'select' ? '#3b82f6' : '#64748b'} />
                <Text style={[styles.modeToggleText, timeInputMode === 'select' && styles.modeToggleTextActive]}>
                  Select Time
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeToggleButton, timeInputMode === 'manual' && styles.modeToggleActive]}
                onPress={() => setTimeInputMode('manual')}
              >
                <Edit3 size={16} color={timeInputMode === 'manual' ? '#3b82f6' : '#64748b'} />
                <Text style={[styles.modeToggleText, timeInputMode === 'manual' && styles.modeToggleTextActive]}>
                  Type Time
                </Text>
              </TouchableOpacity>
            </View>

            {timeInputMode === 'manual' ? (
              /* Manual Time Input */
              <View style={styles.manualTimeContainer}>
                <Text style={styles.manualTimeHint}>Enter time in 24-hour format</Text>
                <TextInput
                  style={styles.manualTimeInput}
                  value={manualTime}
                  onChangeText={(text) => {
                    // Auto-format: add colon after 2 digits
                    let formatted = text.replace(/[^0-9]/g, '');
                    if (formatted.length > 2) {
                      formatted = formatted.slice(0, 2) + ':' + formatted.slice(2, 4);
                    }
                    setManualTime(formatted.toUpperCase());
                  }}
                  placeholder="HH:MM"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  autoFocus
                />
                <Text style={styles.manualTimeExample}>Example: 14:30, 09:00, 23:45</Text>
              </View>
            ) : (
              /* Scrollable Time Options - Takes half screen height */
              <ScrollView
                style={styles.timeScrollList}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.timeScrollContent}
              >
                {timeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.optionItem, deadlineTime === option.value && styles.optionItemSelected]}
                    onPress={() => {
                      setDeadlineTime(option.value);
                      goNext();
                    }}
                  >
                    <Text style={[styles.optionText, deadlineTime === option.value && styles.optionTextSelected]}>
                      {option.label}
                    </Text>
                    {deadlineTime === option.value && <Check size={20} color="#3b82f6" />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        );

      case 'priority':
        return (
          <View style={styles.stepContent}>
            <View style={styles.priorityOptions}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.priorityItem,
                    { backgroundColor: option.bgColor },
                    priority === option.value && { borderColor: option.color, borderWidth: 2 }
                  ]}
                  onPress={() => setPriority(option.value)}
                >
                  <View style={[styles.priorityBadge, { backgroundColor: option.color }]}>
                    <Text style={styles.priorityBadgeText}>{option.label[0]}</Text>
                  </View>
                  <View style={styles.priorityInfo}>
                    <Text style={[styles.priorityLabel, { color: option.color }]}>{option.label}</Text>
                    <Text style={styles.priorityHint}>{option.hint}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'duration':
        return (
          <View style={styles.stepContent}>
            <View style={styles.durationContainer}>
              <Text style={styles.durationLabel}>Estimated Duration</Text>
              <View style={styles.durationControls}>
                <TouchableOpacity style={styles.durationButton} onPress={() => adjustDuration(-15)}>
                  <Text style={styles.durationButtonText}>-15m</Text>
                </TouchableOpacity>
                <View style={styles.durationValue}>
                  <Text style={styles.durationNumber}>{estimatedDuration}</Text>
                  <Text style={styles.durationUnit}>minutes</Text>
                </View>
                <TouchableOpacity style={styles.durationButton} onPress={() => adjustDuration(15)}>
                  <Text style={styles.durationButtonText}>+15m</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.durationPresets}>
                {[30, 60, 90, 120].map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    style={[styles.durationPreset, estimatedDuration === String(mins) && styles.durationPresetActive]}
                    onPress={() => setEstimatedDuration(String(mins))}
                  >
                    <Text style={[styles.durationPresetText, estimatedDuration === String(mins) && styles.durationPresetTextActive]}>
                      {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'review':
        return (
          <View style={styles.stepContent}>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Review Your Task</Text>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Title</Text>
                <Text style={styles.reviewValue}>{title}</Text>
              </View>
              {description ? (
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Description</Text>
                  <Text style={styles.reviewValue}>{description}</Text>
                </View>
              ) : null}
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Date & Time</Text>
                <Text style={styles.reviewValue}>{formatDateDisplay(deadline)} at {new Date(`2000-01-01T${deadlineTime}:00`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Priority</Text>
                <View style={[styles.priorityBadgeLarge, { backgroundColor: priorityOptions.find(p => p.value === priority)?.color }]}>
                  <Text style={styles.priorityBadgeLargeText}>{priority}</Text>
                </View>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Duration</Text>
                <Text style={styles.reviewValue}>{estimatedDuration} minutes</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => currentStep === 0 ? router.back() : goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.stepCounter}>{isEditMode ? 'Edit Task' : `Step ${currentStep + 1} of ${TASK_STEPS.length}`}</Text>
            <Text style={styles.stepTitle}>{currentConfig.label}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentStep + 1) / TASK_STEPS.length) * 100}%`}]} />
          </View>
        </View>

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>{currentConfig.helper}</Text>
        </View>

        {/* Step Content */}
        {renderStepContent()}

        {/* Footer */}
        <View style={styles.footer}>
          {isLastStep ? (
            <TouchableOpacity
              style={[styles.primaryButton, taskMutation.isPending && styles.primaryButtonDisabled]}
              onPress={handleSubmit}
              disabled={taskMutation.isPending}
            >
              <Check size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>{isEditMode ? 'Update Task' : 'Create Task'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryButton, !canContinue && styles.primaryButtonDisabled]}
              onPress={goNext}
              disabled={!canContinue}
            >
              <Text style={styles.primaryButtonText}>{nextLabel}</Text>
              <ChevronRight size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccessModal}
        title={isEditMode ? "Task Updated!" : "Task Created!"}
        message={isEditMode ? "Your task has been updated successfully." : "Your new task has been added successfully."}
        onClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  stepCounter: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  helperContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  helperText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  titleInput: {
    fontSize: 18,
    color: '#1e293b',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  optionsList: {
    flex: 1,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modeToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modeToggleActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  modeToggleTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  timeScrollList: {
    maxHeight: 300,
  },
  timeScrollContent: {
    paddingBottom: 16,
  },
  manualTimeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  manualTimeHint: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  manualTimeInput: {
    width: 150,
    height: 60,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    color: '#1e293b',
  },
  manualTimeExample: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  optionItemSelected: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  priorityOptions: {
    gap: 12,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  priorityBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  priorityBadgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  priorityInfo: {
    flex: 1,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  priorityHint: {
    fontSize: 13,
    color: '#64748b',
  },
  durationContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  durationLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  durationButton: {
    width: 64,
    height: 64,
    backgroundColor: '#f8fafc',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  durationValue: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  durationNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1e293b',
  },
  durationUnit: {
    fontSize: 14,
    color: '#64748b',
  },
  durationPresets: {
    flexDirection: 'row',
    gap: 12,
  },
  durationPreset: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  durationPresetActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  durationPresetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  durationPresetTextActive: {
    color: '#ffffff',
  },
  reviewCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewValue: {
    fontSize: 16,
    color: '#1e293b',
  },
  priorityBadgeLarge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  priorityBadgeLargeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    padding: 24,
    paddingBottom: 45,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
