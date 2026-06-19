import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Search } from "lucide-react-native";
import { useCommandPalette } from "./CommandPaletteProvider";

export default function CommandPaletteLauncher() {
  const { open } = useCommandPalette();

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={open} activeOpacity={0.9}>
        <Search size={22} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 108,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
});
