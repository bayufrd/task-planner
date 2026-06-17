import { Task, TaskDifficulty } from "../types";

export function calculatePriority(task: {
  deadlineDays: number;
  difficulty: TaskDifficulty;
  duration: number;
}) {
  let score = 0;

  if (task.deadlineDays <= 1) score += 5;
  else if (task.deadlineDays <= 3) score += 3;

  if (task.difficulty === "hard") score += 3;
  if (task.difficulty === "medium") score += 2;

  if (task.duration > 3) score += 2;

  return score;
}

export function getPriorityLabel(score: number): "High" | "Medium" | "Low" {
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}

export function generateDailySchedule(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    const scoreA = a.priorityScore || 0;
    const scoreB = b.priorityScore || 0;
    
    if (scoreB !== scoreA) return scoreB - scoreA;
    
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}
