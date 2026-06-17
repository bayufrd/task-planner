import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { taskService } from "../../services/task.service";
import { Plus } from "lucide-react-native";

export default function TaskListScreen() {
  const router = useRouter();
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getTasks,
  });

  return (
    <View className="flex-1 bg-light">
      <View className="p-4 pt-12 bg-white flex-row justify-between items-center">
        <Text className="text-2xl font-bold">My Tasks</Text>
        <TouchableOpacity 
          onPress={() => router.push("/(main)/create-task")}
          className="bg-primary p-2 rounded-full"
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.push(`/(main)/task/${item.id}`)}
            className="bg-white p-4 rounded-xl mb-4 shadow-sm"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-lg font-bold">{item.title}</Text>
                <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
              <View className={`px-2 py-1 rounded ${
                item.difficulty === 'hard' ? 'bg-danger/10' : 
                item.difficulty === 'medium' ? 'bg-warning/10' : 'bg-success/10'
              }`}>
                <Text className={`text-xs font-bold ${
                  item.difficulty === 'hard' ? 'text-danger' : 
                  item.difficulty === 'medium' ? 'text-warning' : 'text-success'
                }`}>
                  {item.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row justify-between items-center">
              <Text className="text-gray-400 text-xs">
                Deadline: {new Date(item.deadline).toLocaleDateString()}
              </Text>
              <Text className="text-primary font-bold">{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
