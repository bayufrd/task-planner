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

export interface AuthContext {
  clientType?: 'mobile' | 'web' | 'internal' | 'unknown';
  captchaRequired?: boolean;
  deviceId?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: string;
  sessionId?: string;
  authContext?: AuthContext;
  provider?: string;
}

export interface AuthResponse {
  success?: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: string;
  sessionId?: string;
  authContext?: AuthContext;
  provider?: string;
  data?: AuthResponseData;
}

export interface ClientAuthPayload {
  email: string;
  password: string;
  refreshToken?: string;
  clientType?: 'mobile' | 'web' | 'internal' | 'unknown';
  deviceId?: string;
  appVersion?: string;
  platform?: string;
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

export interface OverviewAdvice {
  title: string;
  description: string;
  type: "success" | "warning" | "info";
}

export interface OverviewAnalysis {
  score: number;
  insights: string[];
  advice: OverviewAdvice[];
}

export interface ParsedTaskCommand {
  title: string;
  description?: string;
  deadline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedDuration: number;
  tags: string[];
  reminderTime: number;
}
