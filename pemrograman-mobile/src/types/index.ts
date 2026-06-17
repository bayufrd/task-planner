export interface User {
  id: string;
  email: string;
  name?: string;
}

export type TaskStatus = "PENDING" | "DONE" | "SKIPPED";
export type TaskDifficulty = "easy" | "medium" | "hard";

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  difficulty: TaskDifficulty;
  estimatedDuration: number;
  status: TaskStatus;
  priorityScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  streakDays: number;
}
