import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { useQuery, useIsFocused } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { taskService } from "../../../services/task.service";
import { useAuthStore } from "../../../store/auth.store";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, XCircle } from "lucide-react-native";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { Task } from "../../types";

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

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
    if (rate >= 80) return `🎉 Excellent! You've completed ${done} of ${total} tasks!`;
    if (rate >= 50) return `💪 Keep going! ${total - done} tasks remaining.`;
    if (rate >= 25) return `🚀 Good start! ${total - done} more to go.`;
    return `📋 ${total - done} tasks pending. Let's get started!`;
  };

  const todayTasks = getTasksForDay(new Date());
  const selectedDateTasks = getTasksForDay(selectedDate);
  const todayTaskCount = todayTasks.length;

  const getStartPadding = () => {
    const day = monthStart.getDay();
    return Array(day).fill(null);
  };

  const difficultyColors: Record<string, string> = {
    hard: '#ef4444',
    medium: '#f97316',
    easy: '#22c55e',
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.statValue}>{(stats?.total || 0) - (stats?.done || 0)}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3b82f6"
            />
          }
        >
          {selectedDateTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No tasks for this day</Text>
              <Text style={styles.emptySubtext}>Tap + to add a new task</Text>
            </View>
          ) : (
            selectedDateTasks.map((task) => (
              <TouchableOpacity 
                key={task.id} 
                style={styles.taskCard}
                onPress={() => router.push("/(main)/new-task")}
              >
                <View style={styles.taskLeft}>
                  <View style={[styles.priorityIndicator, { backgroundColor: difficultyColors[task.difficulty || 'medium'] }]} />
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                    {task.description && (
                      <Text style={styles.taskDesc} numberOfLines={1}>{task.description}</Text>
                    )}
                  </View>
                </View>
                <View style={[styles.statusBadge, {
                  backgroundColor: task.status === 'DONE' ? '#dcfce7' :
                                   task.status === 'PENDING' ? '#fef3c7' : '#f3f4f6'
                }]}>
                  <Text style={[styles.statusText, {
                    color: task.status === 'DONE' ? '#16a34a' :
                           task.status === 'PENDING' ? '#d97706' : '#6b7280'
                  }]}>
                    {task.status === 'PENDING' ? 'Pending' :
                     task.status === 'DONE' ? 'Done' :
                     task.status === 'SKIPPED' ? 'Skipped' : task.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Statistics Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 Progress Summary</Text>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>⭐</Text>
            <Text style={styles.summaryValue}>{stats?.done || 0}</Text>
            <Text style={styles.summaryLabel}>Score</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>⏱️</Text>
            <Text style={styles.summaryValue}>{calculateTotalHoursLogged()}</Text>
            <Text style={styles.summaryLabel}>Hours Logged</Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>📝</Text>
            <Text style={styles.summaryValue}>{calculateEstimatedHoursNeeded()}</Text>
            <Text style={styles.summaryLabel}>Hours Needed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>📈</Text>
            <Text style={styles.summaryValue}>{Math.round(stats?.completionRate || 0)}%</Text>
            <Text style={styles.summaryLabel}>Progress</Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(stats?.completionRate || 0, 100)}%` }]} />
          </View>
        </View>
        
        <Text style={styles.summaryFooter}>
          {getProgressMessage()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
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
    marginBottom: 16,
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
  summaryIcon: {
    fontSize: 20,
    marginBottom: 4,
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
  summaryFooter: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
});
