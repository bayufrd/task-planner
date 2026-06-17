import api from "./api";
import { Task, TaskStats } from "../types";

export const taskService = {
  getTasks: async () => {
    const response = await api.get<Task[]>("/tasks");
    return response.data;
  },
  getTask: async (id: string) => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },
  createTask: async (data: Partial<Task>) => {
    const response = await api.post<Task>("/tasks", data);
    return response.data;
  },
  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
  getStats: async () => {
    const response = await api.get<TaskStats>("/tasks/stats");
    return response.data;
  },
};
