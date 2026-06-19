import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Sparkles, TriangleAlert } from "lucide-react-native";

export type CommandPaletteFeedbackTone = "loading" | "success" | "error";

interface CommandPaletteFeedbackBannerProps {
  visible: boolean;
  tone: CommandPaletteFeedbackTone;
  title: string;
  message?: string;
}

export default function CommandPaletteFeedbackBanner({
  visible,
  tone,
  title,
  message,
}: CommandPaletteFeedbackBannerProps) {
  if (!visible) {
    return null;
  }

  const isLoading = tone === "loading";
  const colors =
    tone === "success"
      ? { bg: "#dcfce7", border: "#86efac", text: "#166534", icon: "#16a34a" }
      : tone === "error"
        ? { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b", icon: "#dc2626" }
        : { bg: "#dbeafe", border: "#93c5fd", text: "#1d4ed8", icon: "#2563eb" };

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={[styles.banner, { backgroundColor: colors.bg, borderColor: colors.border }]}> 
        <View style={styles.iconWrap}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.icon} />
          ) : tone === "success" ? (
            <CheckCircle2 size={18} color={colors.icon} />
          ) : tone === "error" ? (
            <TriangleAlert size={18} color={colors.icon} />
          ) : (
            <Sparkles size={18} color={colors.icon} />
          )}
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {message ? <Text style={[styles.message, { color: colors.text }]}>{message}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    zIndex: 50,
  },
  banner: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 7,
  },
  iconWrap: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
  message: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
  },
});
