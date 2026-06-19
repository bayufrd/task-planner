import React, { useEffect } from "react";
import { Alert, View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useAuthStore } from "../../../store/auth.store";
import { useRouter } from "expo-router";
import { LogOut, User, Settings, Bell, ChevronRight, Award, Calendar } from "lucide-react-native";
import { notificationService } from "../../../notifications/notification.service";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  // Watch auth state and redirect when logged out
  useEffect(() => {
    console.log("[Profile] useEffect - user:", user ? user.email : "null", "token:", token ? "exists" : "null", "isLoggingOut:", isLoggingOut);
    if (!token && !user && !isLoggingOut) {
      console.log("[Profile] No auth, redirecting to login");
      router.replace("/(auth)/login");
    }
  }, [user, token, isLoggingOut]);

  const handleLogout = async () => {
    console.log("[Profile] handleLogout called");
    await logout();
    console.log("[Profile] logout completed");
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.sendTestNotification();
      Alert.alert("Test notification dijadwalkan", "Notifikasi lokal akan muncul dalam 2 detik.");
    } catch (error: any) {
      Alert.alert("Test notification gagal", error?.message || "Tidak bisa menjadwalkan notifikasi lokal.");
    }
  };

  const stats = [
    { label: "Total Tasks", value: "24", color: "#3b82f6" },
    { label: "Completed", value: "18", color: "#22c55e" },
    { label: "Streak", value: "7 days", color: "#f59e0b" },
  ];

  const menuItems = [
    { icon: <Bell size={20} color="#666" />, title: "Notifications", subtitle: "Manage reminders" },
    { icon: <Settings size={20} color="#666" />, title: "Settings", subtitle: "App preferences" },
    { icon: <Award size={20} color="#666" />, title: "Achievements", subtitle: "View your badges" },
    { icon: <Calendar size={20} color="#666" />, title: "Calendar", subtitle: "Sync with calendar" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Profile</Text>
            <Text style={styles.userName}>{user?.name || "Student"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color="#3b82f6" />
          </View>
          <View style={styles.avatarBadge}>
            <Award size={16} color="#fff" />
          </View>
        </View>
        <Text style={styles.profileName}>{user?.name || "Student"}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.heroCard}>
        <Image
          source={require('../../../../assets/nextjs-profile-hero.webp')}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                {item.icon}
                <View style={styles.menuItemText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>?</Text>
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuTitle}>Help & Support</Text>
                <Text style={styles.menuSubtitle}>Get assistance</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
            <View style={styles.menuItemLeft}>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>i</Text>
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuTitle}>App Version</Text>
                <Text style={styles.menuSubtitle}>1.0.0</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.testNotificationButton} onPress={handleTestNotification}>
        <Bell size={20} color="#2563eb" />
        <Text style={styles.testNotificationText}>Test Local Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="#ef4444" />
        ) : (
          <LogOut size={20} color="#ef4444" />
        )}
        <Text style={[styles.logoutText, isLoggingOut && styles.logoutTextDisabled]}>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#3b82f6",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#3b82f6",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f59e0b",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  profileEmail: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  editButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#eff6ff",
    borderRadius: 20,
  },
  editButtonText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  heroCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#dbeafe",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  heroImage: {
    width: "100%",
    height: 160,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  infoIconText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  testNotificationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    gap: 8,
  },
  testNotificationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutTextDisabled: {
    color: "#fca5a5",
  },
  bottomSpacing: {
    height: 40,
  },
});
