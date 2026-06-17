import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { taskService } from "../../services/task.service";
import { useAuthStore } from "../../store/auth.store";

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading } = useQuery({
    queryKey: ["taskStats"],
    queryFn: taskService.getStats,
  });

  return (
    <ScrollView className="flex-1 bg-light p-4">
      <View className="mt-8 mb-6">
        <Text className="text-2xl font-bold">Hello, {user?.name || "Student"}!</Text>
        <Text className="text-gray-500">Here's your study progress</Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        <StatCard title="Total Tasks" value={stats?.total || 0} color="bg-primary" />
        <StatCard title="Completed" value={stats?.completed || 0} color="bg-success" />
        <StatCard title="Pending" value={stats?.pending || 0} color="bg-warning" />
        <StatCard title="Streak" value={`${stats?.streakDays || 0} Days`} color="bg-secondary" />
      </View>

      <View className="bg-white p-6 rounded-2xl mt-4 shadow-sm">
        <Text className="text-lg font-bold mb-2">Completion Rate</Text>
        <Text className="text-4xl font-bold text-primary">{stats?.completionRate || 0}%</Text>
        <View className="h-2 bg-gray-200 rounded-full mt-4">
          <View 
            className="h-2 bg-primary rounded-full" 
            style={{ width: `${stats?.completionRate || 0}%` }} 
          />
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <View className={`w-[48%] p-4 rounded-2xl mb-4 ${color}`}>
      <Text className="text-white/80 text-sm font-medium">{title}</Text>
      <Text className="text-white text-2xl font-bold mt-1">{value}</Text>
    </View>
  );
}
