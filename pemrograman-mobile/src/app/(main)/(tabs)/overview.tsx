import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Image, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { taskService, DailyStat, WeeklyStat } from "../../../services/task.service";
import { RefreshCw, Trophy, Star, Zap, TrendingUp, Calendar, CheckCircle2, AlertCircle } from "lucide-react-native";

const { width } = Dimensions.get('window');

interface AnimalLevel {
  name: string;
  description: string;
  color: string;
  image: any;
}

const getAnimalLevel = (score: number): AnimalLevel => {
  if (score <= 10) return { name: 'Batu Rebahan', description: 'Hampir tidak bergerak, task cuma dilihat doang', color: '#6b7280', image: require('../../../../assets/1.webp') };
  if (score <= 20) return { name: 'Siput Loading', description: 'Ada niat, tapi progress lambat banget', color: '#f59e0b', image: require('../../../../assets/2.webp') };
  if (score <= 30) return { name: 'Kucing Mager', description: 'Mau produktif, tapi kasur lebih kuat', color: '#f97316', image: require('../../../../assets/3.webp') };
  if (score <= 40) return { name: 'Panda Santuy', description: 'Ada kerjaan selesai, tapi banyak jeda ngemil', color: '#64748b', image: require('../../../../assets/4.webp') };
  if (score <= 50) return { name: 'Badak Si Pemalas', description: 'Kuat sebenarnya, tapi susah mulai', color: '#64748b', image: require('../../../../assets/5.webp') };
  if (score <= 60) return { name: 'Bebek Mulai Jalan', description: 'Sudah mulai konsisten, walau masih goyang', color: '#eab308', image: require('../../../../assets/6.webp') };
  if (score <= 70) return { name: 'Kelinci Si Rajin', description: 'Task mulai banyak selesai, ritme bagus', color: '#ec4899', image: require('../../../../assets/7.webp') };
  if (score <= 80) return { name: 'Semut Produktif', description: 'Rapi, konsisten, dan jarang skip', color: '#d97706', image: require('../../../../assets/8.webp') };
  if (score <= 90) return { name: 'Elang Fokus', description: 'Fokus tinggi, prioritas jelas', color: '#8b5cf6', image: require('../../../../assets/9.webp') };
  return { name: 'Naga Deadline', description: 'Mode legenda, task tunduk semua', color: '#ef4444', image: require('../../../../assets/10.webp') };
};

export default function OverviewScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["taskStats"],
    queryFn: taskService.getStats,
  });

  const { data: dailyStats, isLoading: dailyLoading, refetch: refetchDaily } = useQuery({
    queryKey: ["dailyStats"],
    queryFn: () => taskService.getDailyStats(30),
  });

  const { data: weeklyStats, isLoading: weeklyLoading, refetch: refetchWeekly } = useQuery({
    queryKey: ["weeklyStats"],
    queryFn: () => taskService.getWeeklyStats(12),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchStats(), refetchDaily(), refetchWeekly()]);
    setIsRefreshing(false);
  };

  const completionRate = stats?.completionRate || 0;
  const level = getAnimalLevel(completionRate);

  const dailyData = Array.isArray(dailyStats) ? dailyStats : [];
  const weeklyData = Array.isArray(weeklyStats) ? weeklyStats : [];
  const maxDailyCount = dailyData.length > 0 ? Math.max(...dailyData.map(d => d.count), 1) : 1;
  const maxWeeklyCount = weeklyData.length > 0 ? Math.max(...weeklyData.map(w => w.count), 1) : 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Overview</Text>
          <Text style={styles.headerSubtitle}>Your productivity insights</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshCw size={18} color={isRefreshing ? "#3b82f6" : "#64748b"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Level Card */}
        <View style={[styles.levelCard, { borderLeftColor: level.color }]}>
          <View style={styles.levelHeader}>
            <Image source={level.image} style={styles.levelImage} resizeMode="contain" />
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{level.name}</Text>
              <Text style={styles.levelDesc}>{level.description}</Text>
            </View>
          </View>
          <View style={styles.levelProgress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionRate}%`, backgroundColor: level.color }]} />
            </View>
            <Text style={styles.progressText}>{completionRate}% Complete</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
              <Calendar size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>{stats?.pending || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
              <CheckCircle2 size={20} color="#22c55e" />
            </View>
            <Text style={styles.statValue}>{stats?.completed || 0}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <AlertCircle size={20} color="#f59e0b" />
            </View>
            <Text style={styles.statValue}>{(stats?.total || 0) - (stats?.completed || 0)}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        {/* Daily Activity Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Daily Activity</Text>
            <Text style={styles.chartSubtitle}>Last 30 days</Text>
          </View>
          {dailyLoading ? (
            <ActivityIndicator color="#3b82f6" style={styles.loader} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll}>
              <View style={styles.barChart}>
                {dailyData.slice(-14).map((day, index) => {
                  const height = (day.count / maxDailyCount) * 100;
                  return (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View 
                          style={[
                            styles.bar, 
                            { height: `${Math.max(height, 5)}%` },
                            day.count > 0 && styles.barActive
                          ]} 
                        />
                      </View>
                      <Text style={styles.barLabel}>
                        {new Date(day.date).getDate()}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Weekly Overview */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Overview</Text>
            <Text style={styles.chartSubtitle}>Last 12 weeks</Text>
          </View>
          {weeklyLoading ? (
            <ActivityIndicator color="#3b82f6" style={styles.loader} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll}>
              <View style={styles.barChart}>
                {weeklyData.slice(-8).map((week, index) => {
                  const height = (week.count / maxWeeklyCount) * 100;
                  return (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View 
                          style={[
                            styles.bar, 
                            { height: `${Math.max(height, 5)}%` },
                            styles.barWeek,
                            week.count > 0 && styles.barActive
                          ]} 
                        />
                      </View>
                      <Text style={styles.barLabel}>W{index + 1}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>

        {/* AI Insights Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Zap size={20} color="#f59e0b" />
            <Text style={styles.insightTitle}>Productivity Insights</Text>
          </View>
          <View style={styles.insightContent}>
            <View style={styles.insightItem}>
              <TrendingUp size={16} color="#22c55e" />
              <Text style={styles.insightText}>
                {stats?.completed || 0} tasks completed this period
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Trophy size={16} color="#f59e0b" />
              <Text style={styles.insightText}>
                Current streak: {Math.round((stats?.completionRate || 0) / 10)} days
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Star size={16} color="#8b5cf6" />
              <Text style={styles.insightText}>
                Completion rate: {completionRate}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  levelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  levelDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  levelProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  chartScroll: {
    marginHorizontal: -8,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
    width: 24,
  },
  barWrapper: {
    height: 100,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
  },
  barWeek: {
    width: 24,
  },
  barActive: {
    backgroundColor: '#3b82f6',
  },
  barLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  loader: {
    height: 100,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  insightContent: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});
