import api from "./api";
import { OverviewAnalysis, ParsedTaskCommand, Task, TaskStats } from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Raw stats from backend
interface RawTaskStats {
  pending: number;
  done: number;
  skipped: number;
}

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>("/tasks");
    return response.data?.data || [];
  },
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data?.data;
  },
  createTask: async (data: Partial<Task>): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>("/tasks", data);
    return response.data?.data;
  },
  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data?.data;
  },
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  updateTaskStatus: async (id: string, status: string): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status });
    return response.data?.data;
  },
  getStats: async (): Promise<TaskStats> => {
    try {
      const response = await api.get<ApiResponse<RawTaskStats>>("/tasks/stats");
      const raw = response.data?.data;
      if (!raw) {
        return { pending: 0, done: 0, skipped: 0, total: 0, completed: 0, completionRate: 0, streakDays: 0 };
      }
      const total = raw.pending + raw.done + raw.skipped;
      const completed = raw.done;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      return {
        ...raw,
        total,
        completed,
        completionRate,
        streakDays: 0,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return { pending: 0, done: 0, skipped: 0, total: 0, completed: 0, completionRate: 0, streakDays: 0 };
    }
  },
  getDailyStats: async (days: number = 30): Promise<{ date: string; count: number }[]> => {
    try {
      const response = await api.get<ApiResponse<{ date: string; count: number }[]>>(`/tasks/stats/daily?days=${days}`);
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      return [];
    }
  },
  getWeeklyStats: async (weeks: number = 12): Promise<{ week: string; count: number }[]> => {
    try {
      const response = await api.get<ApiResponse<{ week: string; count: number }[]>>(`/tasks/stats/weekly?weeks=${weeks}`);
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      return [];
    }
  },
  analyzeOverview: async (stats: Pick<TaskStats, "pending" | "done" | "skipped">, dailyData: DailyStat[]): Promise<OverviewAnalysis> => {
    const response = await api.post<ApiResponse<OverviewAnalysis>>("/ai/overview-analysis", {
      stats: {
        pending: stats.pending,
        done: stats.done,
        skipped: stats.skipped,
      },
      dailyData,
    });

    return response.data?.data;
  },
  parseTaskCommand: async (command: string): Promise<ParsedTaskCommand> => {
    const response = await api.post<ApiResponse<ParsedTaskCommand>>("/ai/parse-task", {
      command,
    });

    return response.data?.data;
  },
};

export interface DailyStat {
  date: string;
  count: number;
}

export interface WeeklyStat {
  week: string;
  count: number;
}

export interface TaskStatsResponse {
  pending: number;
  done: number;
  total: number;
}
