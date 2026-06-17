import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useAuthStore } from "../../store/auth.store";
import { useRouter } from "expo-router";
import { LogOut, User, Settings, Bell } from "lucide-react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white p-8 items-center pt-16">
        <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
          <User size={48} color="#007AFF" />
        </View>
        <Text className="text-2xl font-bold">{user?.name || "Student"}</Text>
        <Text className="text-gray-500">{user?.email}</Text>
      </View>

      <View className="mt-4 px-4">
        <ProfileMenuItem icon={<Bell size={20} color="#666" />} title="Notifications" />
        <ProfileMenuItem icon={<Settings size={20} color="#666" />} title="Settings" />
        
        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center bg-white p-4 rounded-xl mt-4"
        >
          <LogOut size={20} color="#FF3B30" />
          <Text className="ml-4 text-danger font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProfileMenuItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-xl mb-2">
      {icon}
      <Text className="ml-4 text-gray-700 font-medium">{title}</Text>
    </TouchableOpacity>
  );
}
