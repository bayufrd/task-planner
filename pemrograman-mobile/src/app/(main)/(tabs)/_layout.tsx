import { Tabs } from "expo-router";
import { LayoutDashboard, BarChart3, User } from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              {focused ? <TabGradient /> : null}
              <LayoutDashboard color={color} size={22} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              {focused ? <TabGradient /> : null}
              <BarChart3 color={color} size={22} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              {focused ? <TabGradient /> : null}
              <User color={color} size={22} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

function TabGradient() {
  return (
    <View pointerEvents="none" style={styles.iconGradient}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="tabGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#2563eb" />
            <Stop offset="100%" stopColor="#4f46e5" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" rx="24" ry="24" fill="url(#tabGradient)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    paddingTop: 8,
    paddingBottom: 25,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconFocused: {
    position: "relative",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: "hidden",
  },
  iconGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
});
