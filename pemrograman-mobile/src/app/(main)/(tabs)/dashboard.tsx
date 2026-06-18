import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { taskService } from "../../../services/task.service";
import { useAuthStore } from "../../../store/auth.store";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, XCircle, BarChart3, Timer, FileText, TrendingUp, Tag, CircleAlert, Trash2 } from "lucide-react-native";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { Task } from "../../../types";
import ConfirmationModal from "../../../components/ConfirmationModal";
import SuccessModal from "../../../components/SuccessModal";
import TaskDetailModal from "../../../components/TaskDetailModal";

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    type: 'done' | 'delete';
    taskId: string;
    taskTitle: string;
  }>({ visible: false, type: 'done', taskId: '', taskTitle: '' });
  
  // Success modal state
  const [successModal, setSuccessModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // Task detail modal state
  const [detailModal, setDetailModal] = useState<{
    visible: boolean;
    task: Task | null;
  }>({ visible: false, task: null });

  const { data: stats, isLoading, refetch: refetchStats } = useQuery({
    queryKey: ["taskStats"],
    queryFn: taskService.getStats,
    staleTime: 0,
    refetchOnMount: true,
  });

  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getTasks,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Refetch when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetchTasks();
      refetchStats();
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchTasks(), refetchStats()]);
    setRefreshing(false);
  }, [refetchTasks, refetchStats]);

  const handleCompleteTask = (taskId: string, taskTitle: string) => {
    setConfirmModal({
      visible: true,
      type: 'done',
      taskId,
      taskTitle,
    });
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    setConfirmModal({
      visible: true,
      type: 'delete',
      taskId,
      taskTitle,
    });
  };

  const handleConfirmAction = async () => {
    const { type, taskId } = confirmModal;
    setConfirmModal(prev => ({ ...prev, visible: false }));
    
    try {
      if (type === 'done') {
        await taskService.updateTaskStatus(taskId, 'DONE');
        setSuccessModal({
          visible: true,
          title: 'Task Completed!',
          message: 'Great job! Keep up the good work.',
        });
      } else {
        await taskService.deleteTask(taskId);
        setSuccessModal({
          visible: true,
          title: 'Task Deleted',
          message: 'The task has been removed.',
        });
      }
      refetchTasks();
      refetchStats();
    } catch (error) {
      console.error(`Failed to ${type} task:`, error);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDay = (day: Date): Task[] => {
    if (!tasks || !Array.isArray(tasks)) return [];
    return tasks.filter((task) => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getFullYear() === day.getFullYear() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getDate() === day.getDate() &&
        task.status !== 'DONE' &&
        task.status !== 'SKIPPED'
      );
    });
  };

  // Calculate total hours logged (based on completed tasks' estimated duration)
  const calculateTotalHoursLogged = (): string => {
    if (!tasks || !Array.isArray(tasks)) return '0';
    const completedTasks = tasks.filter((t) => t.status === 'DONE');
    const totalMinutes = completedTasks.reduce((sum, t) => sum + (t.estimatedDuration || 30), 0);
    const hours = Math.floor(totalMinutes / 60);
    return hours > 0 ? `${hours}h ${totalMinutes % 60}m` : `${totalMinutes}m`;
  };

  // Calculate estimated hours still needed for pending tasks
  const calculateEstimatedHoursNeeded = (): string => {
    if (!tasks || !Array.isArray(tasks)) return '0';
    const pendingTasks = tasks.filter((t) => t.status === 'PENDING');
    const totalMinutes = pendingTasks.reduce((sum, t) => sum + (t.estimatedDuration || 30), 0);
    const hours = Math.floor(totalMinutes / 60);
    return hours > 0 ? `${hours}h ${totalMinutes % 60}m` : `${totalMinutes}m`;
  };

  // Get progress message based on completion rate
  const getProgressMessage = (): string => {
    const rate = stats?.completionRate || 0;
    const done = stats?.done || 0;
    const total = stats?.total || 0;
    if (total === 0) return 'Start your first task to track progress!';
    if (rate >= 80) return `Excellent! You've completed ${done} of ${total} tasks!`;
    if (rate >= 50) return `Keep going! ${total - done} tasks remaining.`;
    if (rate >= 25) return `Good start! ${total - done} more to go.`;
    return `${total - done} tasks pending. Let's get started!`;
  };

  const todayTasks = getTasksForDay(new Date());
  const selectedDateTasks = getTasksForDay(selectedDate);
  const todayTaskCount = todayTasks.length;

  const getStartPadding = () => {
    const day = monthStart.getDay();
    return Array(day).fill(null);
  };

  const priorityColors: Record<string, string> = {
    HIGH: '#ef4444',
    MEDIUM: '#f97316',
    LOW: '#22c55e',
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3b82f6"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSubtitle}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(main)/new-task")}
        >
          <Plus color="#fff" size={20} />
          <Text style={styles.addButtonText}>New Task</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Section */}
      <View style={styles.calendarSection}>
        {/* Today Quick View */}
        <TouchableOpacity
          style={styles.todayCard}
          onPress={() => setSelectedDate(new Date())}
        >
          <View style={styles.todayLeft}>
            <Text style={styles.todayLabel}>TODAY</Text>
            <Text style={styles.todayDate}>{format(new Date(), 'EEEE, MMM d')}</Text>
            <Text style={styles.todayHint}>Tap to view tasks</Text>
          </View>
          <View style={styles.todayRight}>
            <Text style={styles.todayCount}>{todayTaskCount}</Text>
            <Text style={styles.todayCountLabel}>{todayTaskCount === 1 ? 'task' : 'tasks'}</Text>
          </View>
        </TouchableOpacity>

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft size={24} color="#64748b" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View style={styles.weekDaysRow}>
          {weekDays.map((day) => (
            <View key={day} style={styles.weekDayCell}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {/* Start padding */}
          {getStartPadding().map((_, index) => (
            <View key={`pad-${index}`} style={styles.calendarCell} />
          ))}
          {/* Days */}
          {daysInMonth.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const isPast = day < new Date() && !isToday;

            return (
              <TouchableOpacity
                key={day.toISOString()}
                style={[
                  styles.calendarCell,
                  isToday && styles.todayCell,
                  isSelected && styles.selectedCell,
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text style={[
                  styles.dayText,
                  isToday && styles.todayDayText,
                  isSelected && styles.selectedDayText,
                  isPast && styles.pastDayText,
                ]}>
                  {format(day, 'd')}
                </Text>
                {dayTasks.length > 0 && (
                  <View style={styles.taskDots}>
                    {dayTasks.slice(0, 3).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.taskDot,
                          isToday && styles.todayTaskDot,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Stats Counter Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Clock size={18} color="#3b82f6" />
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{stats?.pending || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <CheckCircle2 size={18} color="#22c55e" />
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{stats?.done || 0}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <XCircle size={18} color="#f97316" />
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{stats?.skipped || 0}</Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>
        </View>
      </View>

      {/* Selected Date Tasks */}
      <View style={styles.tasksSection}>
        <Text style={styles.tasksSectionTitle}>
          {format(selectedDate, 'EEEE, MMMM d')}
        </Text>
        <ScrollView
          style={styles.tasksList}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {selectedDateTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={40} color="#94a3b8" />
              <Text style={styles.emptyText}>No tasks for this day</Text>
              <Text style={styles.emptySubtext}>Tap + to add a new task</Text>
            </View>
          ) : (
            selectedDateTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => setDetailModal({ visible: true, task })}
              >
                <View style={styles.taskLeft}>
                  <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[task.priority || 'MEDIUM'] || '#f97316' }]} />
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                    {task.description && (
                      <Text style={styles.taskDesc} numberOfLines={1}>{task.description}</Text>
                    )}
                    {/* Task Meta Row */}
                    <View style={styles.taskMetaRow}>
                      {/* Time Left / Overdue */}
                      <View style={styles.taskMetaItem}>
                        {(() => {
                          const now = new Date();
                          const deadline = new Date(task.deadline);
                          const diffMs = deadline.getTime() - now.getTime();
                          const isOverdue = diffMs < 0;
                          const absDiff = Math.abs(diffMs);
                          const hours = Math.floor(absDiff / (1000 * 60 * 60));
                          const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
                          
                          if (isOverdue) {
                            return (
                              <>
                                <CircleAlert size={12} color="#ef4444" />
                                <Text style={[styles.taskMetaText, { color: '#ef4444' }]}>
                                  {hours}h {minutes}m overdue
                                </Text>
                              </>
                            );
                          } else if (hours < 24) {
                            return (
                              <>
                                <Timer size={12} color="#f97316" />
                                <Text style={[styles.taskMetaText, { color: '#f97316' }]}>
                                  {hours}h {minutes}m left
                                </Text>
                              </>
                            );
                          } else {
                            const days = Math.floor(hours / 24);
                            return (
                              <>
                                <Clock size={12} color="#64748b" />
                                <Text style={styles.taskMetaText}>
                                  {days}d left
                                </Text>
                              </>
                            );
                          }
                        })()}
                      </View>
                      {/* Duration */}
                      <View style={styles.taskMetaItem}>
                        <Timer size={12} color="#64748b" />
                        <Text style={styles.taskMetaText}>{task.estimatedDuration || 30}min</Text>
                      </View>
                      {/* Priority Badge */}
                      <View style={[styles.taskDifficultyBadge, { backgroundColor: (priorityColors[task.priority || 'MEDIUM'] || '#f97316') + '20' }]}>
                        <Text style={[styles.taskDifficultyText, { color: priorityColors[task.priority || 'MEDIUM'] || '#f97316' }]}>
                          {task.priority || 'MEDIUM'}
                        </Text>
                      </View>
                    </View>
                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <View style={styles.taskTagsRow}>
                        <Tag size={10} color="#3b82f6" />
                        {task.tags.slice(0, 3).map((tag: { tagName: string }, index: number) => (
                            <View key={index} style={styles.taskTag}>
                              <Text style={styles.taskTagText}>#{tag.tagName}</Text>
                            </View>
                          ))}
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.taskActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.doneButton]}
                    onPress={() => handleCompleteTask(task.id, task.title)}
                  >
                    <CheckCircle2 size={18} color="#22c55e" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteTask(task.id, task.title)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Statistics Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <BarChart3 size={20} color="#3b82f6" />
          <Text style={styles.summaryTitle}>Task Statistics</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconContainer}>
              <Clock size={20} color="#3b82f6" />
            </View>
            <Text style={styles.summaryValue}>{stats?.pending || 0}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconContainer}>
              <CheckCircle2 size={20} color="#22c55e" />
            </View>
            <Text style={styles.summaryValue}>{stats?.done || 0}</Text>
            <Text style={styles.summaryLabel}>Done</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconContainer}>
              <XCircle size={20} color="#f97316" />
            </View>
            <Text style={styles.summaryValue}>{stats?.skipped || 0}</Text>
            <Text style={styles.summaryLabel}>Skipped</Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(stats?.completionRate || 0, 100)}%` }]} />
          </View>
          <Text style={styles.progressBarLabel}>{Math.round(stats?.completionRate || 0)}% Completed</Text>
        </View>
        
        <Text style={styles.summaryFooter}>
          {getProgressMessage()}
        </Text>
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmModal.visible}
        type={confirmModal.type}
        taskTitle={confirmModal.taskTitle}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={successModal.visible}
        title={successModal.title}
        message={successModal.message}
        onClose={() => setSuccessModal(prev => ({ ...prev, visible: false }))}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        visible={detailModal.visible}
        task={detailModal.task}
        onClose={() => setDetailModal({ visible: false, task: null })}
        onEdit={() => {
          if (detailModal.task) {
            setDetailModal({ visible: false, task: null });
            router.push({ pathname: "/(main)/new-task", params: { taskId: detailModal.task.id } });
          }
        }}
        onDone={() => {
          if (detailModal.task) {
            handleCompleteTask(detailModal.task.id, detailModal.task.title);
            setDetailModal({ visible: false, task: null });
          }
        }}
        onDelete={() => {
          if (detailModal.task) {
            handleDeleteTask(detailModal.task.id, detailModal.task.title);
            setDetailModal({ visible: false, task: null });
          }
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    gap: 6,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  calendarSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  todayCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  todayLeft: {
    flex: 1,
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  todayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  todayHint: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 4,
  },
  todayRight: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  todayCount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3b82f6',
  },
  todayCountLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  todayCell: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  selectedCell: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
  },
  todayDayText: {
    color: '#3b82f6',
    fontWeight: '700',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  pastDayText: {
    color: '#cbd5e1',
  },
  taskDots: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 2,
  },
  taskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#f97316',
  },
  todayTaskDot: {
    backgroundColor: '#3b82f6',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  tasksSection: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tasksSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  tasksList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  priorityIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  taskDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontSize: 11,
    color: '#64748b',
  },
  taskDifficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskDifficultyText: {
    fontSize: 9,
    fontWeight: '700',
  },
  taskTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
    flexWrap: 'wrap',
  },
  taskTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskTagText: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButton: {
    backgroundColor: '#dcfce7',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 100,
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIconContainer: {
    marginBottom: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  progressBarContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressBarLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  summaryFooter: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
});
