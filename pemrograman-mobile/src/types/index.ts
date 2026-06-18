export interface User {
  id: string;
  email: string;
  name?: string;
}

export type TaskStatus = "PENDING" | "DONE" | "SKIPPED";
export type TaskDifficulty = "easy" | "medium" | "hard";

export interface Task {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  deadline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedDuration: number;
  reminderTime?: number;
  status: TaskStatus;
  priorityScore?: number;
  tags?: { id: string; tagName: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Backend response format
export interface TaskStats {
  pending: number;
  done: number;
  skipped: number;
  // Computed fields
  total: number;
  completed: number;
  completionRate: number;
  streakDays: number;
}
