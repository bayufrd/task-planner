import { Tabs } from "expo-router";
import { LayoutDashboard, ListTodo, CalendarDays, User } from "lucide-react-native";

export default function MainLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: "#007AFF",
      tabBarStyle: { height: 60, paddingBottom: 10 }
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => <ListTodo color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="daily-plan"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => <CalendarDays color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
