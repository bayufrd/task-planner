interface PriorityFactors {
  deadline: Date;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reminderTime: number; // minutes before deadline
  estimatedDuration: number; // minutes
}

export const calculatePriorityScore = (factors: PriorityFactors): number => {
  const now = new Date();
  const deadlineTime = factors.deadline.getTime();
  const currentTime = now.getTime();
  const timeUntilDeadline = deadlineTime - currentTime;
  const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60);

  // 1. Urgency (40%) - based on time until deadline
  let urgencyScore = 0;
  if (hoursUntilDeadline < 0) {
    urgencyScore = 100; // Overdue
  } else if (hoursUntilDeadline <= 2) {
    urgencyScore = 90;
  } else if (hoursUntilDeadline <= 6) {
    urgencyScore = 80;
  } else if (hoursUntilDeadline <= 24) {
    urgencyScore = 60;
  } else if (hoursUntilDeadline <= 72) {
    urgencyScore = 40;
  } else if (hoursUntilDeadline <= 168) {
    urgencyScore = 20;
  } else {
    urgencyScore = 10;
  }

  // 2. Priority/Importance (35%)
  const priorityScore = factors.priority === 'HIGH' ? 100 : factors.priority === 'MEDIUM' ? 60 : 30;

  // 3. Reminder signal (15%)
  const reminderScore = factors.reminderTime <= 30 ? 100 : factors.reminderTime <= 60 ? 70 : 40;

  // 4. Estimated duration (10%)
  const durationScore = factors.estimatedDuration <= 30 ? 100 : factors.estimatedDuration <= 60 ? 70 : 40;

  // Calculate weighted score
  const totalScore =
    urgencyScore * 0.4 + priorityScore * 0.35 + reminderScore * 0.15 + durationScore * 0.1;

  return Math.round(totalScore);
};