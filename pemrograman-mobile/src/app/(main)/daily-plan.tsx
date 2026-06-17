import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { taskService } from "../../services/task.service";
import { generateDailySchedule } from "../../utils/priority";

export default function DailyPlanScreen() {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getTasks,
  });

  const schedule = tasks ? generateDailySchedule(tasks.filter(t => t.status === "PENDING")) : [];

  return (
    <ScrollView className="flex-1 bg-light p-4">
      <View className="mt-8 mb-6">
        <Text className="text-2xl font-bold">Daily Study Plan</Text>
        <Text className="text-gray-500">Optimized based on priority engine</Text>
      </View>

      {schedule.length === 0 ? (
        <View className="bg-white p-8 rounded-2xl items-center">
          <Text className="text-gray-400">No pending tasks for today!</Text>
        </View>
      ) : (
        schedule.map((task, index) => (
          <View key={task.id} className="flex-row mb-4">
            <View className="items-center mr-4">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold">{index + 1}</Text>
              </View>
              {index !== schedule.length - 1 && <View className="w-0.5 flex-1 bg-primary/20 my-1" />}
            </View>
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm">
              <Text className="font-bold text-lg">{task.title}</Text>
              <View className="flex-row mt-2 items-center">
                <Text className="text-gray-500 text-sm">{task.estimatedDuration} mins</Text>
                <View className="mx-2 w-1 h-1 rounded-full bg-gray-300" />
                <Text className="text-primary text-sm font-medium">Priority Score: {task.priorityScore || 0}</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
