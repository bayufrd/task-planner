import { Tabs } from "expo-router";
import { LayoutDashboard, BarChart3, User } from "lucide-react-native";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabButtonContent, focused && styles.tabButtonContentActive]}>
              {focused ? <TabGradient /> : null}
              <LayoutDashboard color={color} size={18} />
              <Text numberOfLines={1} style={[styles.tabButtonText, focused && styles.tabButtonTextActive]}>Home</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabButtonContent, focused && styles.tabButtonContentActive]}>
              {focused ? <TabGradient /> : null}
              <BarChart3 color={color} size={18} />
              <Text numberOfLines={1} style={[styles.tabButtonText, focused && styles.tabButtonTextActive]}>Overview</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabButtonContent, focused && styles.tabButtonContentActive]}>
              {focused ? <TabGradient /> : null}
              <User color={color} size={18} />
              <Text numberOfLines={1} style={[styles.tabButtonText, focused && styles.tabButtonTextActive]}>Profile</Text>
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
    height: 90,
    paddingTop: 10,
    paddingBottom: 26,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minWidth: 90,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  tabButtonContentActive: {
    borderColor: "#2563eb",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    flexShrink: 0,
  },
  tabButtonTextActive: {
    color: "#ffffff",
  },
  iconGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
});
