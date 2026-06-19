import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  LayoutDashboard,
  Plus,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react-native";
import { taskService } from "../../services/task.service";
import { ParsedTaskCommand } from "../../types";
import { useCommandPalette } from "./CommandPaletteProvider";

type CommandItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  type: "navigation" | "ai";
  action: () => void | Promise<void>;
};

const AI_EXAMPLES = [
  "Buat task presentasi mobile besok jam 10 pagi prioritas tinggi durasi 90 menit",
  "Tambahkan tugas review backend hari Jumat jam 14.00",
  "Rencanakan belajar React Native malam ini selama 2 jam",
];

export default function GlobalCommandPalette() {
  const router = useRouter();
  const { isOpen, close } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedTaskCommand | null>(null);

  const resetAiState = () => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  };

  const handleClose = () => {
    close();
    setQuery("");
    resetAiState();
  };

  const navigateTo = (path: "/(main)/(tabs)/dashboard" | "/(main)/(tabs)/overview" | "/(main)/(tabs)/profile" | "/(main)/new-task") => {
    handleClose();
    router.push(path);
  };

  const handleParseCommand = async (input?: string) => {
    const command = (input ?? query).trim();

    if (!command) {
      setError("Masukkan command AI terlebih dahulu.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const parsed = await taskService.parseTaskCommand(command);
      setResult(parsed);
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || err?.message || "Gagal memproses command AI.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseParsedResult = () => {
    if (!result) {
      return;
    }

    handleClose();
    router.push({
      pathname: "/(main)/new-task",
      params: {
        title: result.title,
        description: result.description || "",
        priority: result.priority,
        deadline: result.deadline,
        estimatedDuration: String(result.estimatedDuration),
      },
    });
  };

  const commands = useMemo<CommandItem[]>(
    () => [
      {
        id: "nav-dashboard",
        title: "Buka Dashboard",
        description: "Masuk ke home dan daftar task harian.",
        icon: LayoutDashboard,
        type: "navigation",
        action: () => navigateTo("/(main)/(tabs)/dashboard"),
      },
      {
        id: "nav-overview",
        title: "Buka Overview",
        description: "Lihat statistik dan insight AI produktivitas.",
        icon: BarChart3,
        type: "navigation",
        action: () => navigateTo("/(main)/(tabs)/overview"),
      },
      {
        id: "nav-profile",
        title: "Buka Profile",
        description: "Masuk ke profil akun.",
        icon: User,
        type: "navigation",
        action: () => navigateTo("/(main)/(tabs)/profile"),
      },
      {
        id: "nav-new-task",
        title: "Tambah Task Baru",
        description: "Buka form task baru.",
        icon: Plus,
        type: "navigation",
        action: () => navigateTo("/(main)/new-task"),
      },
      {
        id: "ai-parse",
        title: "AI Parse Task Command",
        description: "Kirim command natural language ke endpoint AI backend.",
        icon: Brain,
        type: "ai",
        action: () => handleParseCommand(),
      },
    ],
    [query]
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCommands = useMemo(() => {
    if (!normalizedQuery) {
      return commands;
    }

    return commands.filter((item) => {
      const haystack = `${item.title} ${item.description} ${item.type}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [commands, normalizedQuery]);

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <View style={styles.headerIcon}>
                <Sparkles size={18} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.headerTitle}>AI Command Palette</Text>
                <Text style={styles.headerSubtitle}>Global launcher untuk navigasi dan AI parsing.</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="Cari command atau ketik instruksi AI..."
              placeholderTextColor="#94a3b8"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="sentences"
              autoCorrect={false}
            />
          </View>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {filteredCommands.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity key={item.id} style={styles.commandCard} onPress={item.action} activeOpacity={0.85}>
                  <View style={styles.commandLeft}>
                    <View style={styles.commandIcon}>
                      <Icon size={18} color={item.type === "ai" ? "#7c3aed" : "#2563eb"} />
                    </View>
                    <View style={styles.commandTextWrap}>
                      <Text style={styles.commandTitle}>{item.title}</Text>
                      <Text style={styles.commandDescription}>{item.description}</Text>
                    </View>
                  </View>
                  <ArrowRight size={18} color="#94a3b8" />
                </TouchableOpacity>
              );
            })}

            {!filteredCommands.length ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Command tidak ditemukan</Text>
                <Text style={styles.emptyText}>Gunakan teks natural language lalu pilih AI parse.</Text>
              </View>
            ) : null}

            <View style={styles.examplesCard}>
              <Text style={styles.sectionTitle}>Contoh command AI</Text>
              {AI_EXAMPLES.map((example) => (
                <TouchableOpacity
                  key={example}
                  style={styles.exampleChip}
                  onPress={() => {
                    setQuery(example);
                    setError(null);
                  }}
                >
                  <Text style={styles.exampleText}>{example}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {(isLoading || error || result) ? (
              <View style={styles.resultCard}>
                <Text style={styles.sectionTitle}>Hasil AI</Text>

                {isLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#2563eb" />
                    <Text style={styles.loadingText}>Memproses command ke backend AI...</Text>
                  </View>
                ) : null}

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {result ? (
                  <View style={styles.resultContent}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Title</Text>
                      <Text style={styles.resultValue}>{result.title}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Priority</Text>
                      <Text style={styles.resultValue}>{result.priority}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Deadline</Text>
                      <Text style={styles.resultValue}>{new Date(result.deadline).toLocaleString()}</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Duration</Text>
                      <Text style={styles.resultValue}>{result.estimatedDuration} menit</Text>
                    </View>
                    {result.description ? (
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Description</Text>
                        <Text style={styles.resultValue}>{result.description}</Text>
                      </View>
                    ) : null}
                    {result.tags?.length ? (
                      <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Tags</Text>
                        <Text style={styles.resultValue}>{result.tags.join(", ")}</Text>
                      </View>
                    ) : null}

                    <TouchableOpacity style={styles.useButton} onPress={handleUseParsedResult}>
                      <Text style={styles.useButtonText}>Gunakan hasil ini di form task</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    padding: 20,
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    maxHeight: "88%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  input: {
    flex: 1,
    minHeight: 52,
    fontSize: 15,
    color: "#0f172a",
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  commandCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
  },
  commandLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  commandIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  commandTextWrap: {
    flex: 1,
  },
  commandTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  commandDescription: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 18,
  },
  examplesCard: {
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  exampleChip: {
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 13,
    color: "#1e293b",
    lineHeight: 18,
  },
  resultCard: {
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: "#475569",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    lineHeight: 18,
  },
  resultContent: {
    gap: 10,
  },
  resultRow: {
    gap: 4,
  },
  resultLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  resultValue: {
    fontSize: 14,
    color: "#0f172a",
    lineHeight: 20,
  },
  useButton: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    alignItems: "center",
  },
  useButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    padding: 16,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  emptyText: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
});
