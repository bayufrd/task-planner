import { TaskService } from './task.service';

const AUTO_SKIP_INTERVAL_MS = 60 * 1000;

export class TaskAutoSkipScheduler {
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private readonly taskService = new TaskService();

  start() {
    if (this.interval) return;

    void this.run();
    this.interval = setInterval(() => {
      void this.run();
    }, AUTO_SKIP_INTERVAL_MS);
  }

  stop() {
    if (!this.interval) return;

    clearInterval(this.interval);
    this.interval = null;
  }

  private async run() {
    if (this.isRunning) return;

    this.isRunning = true;

    try {
      const result = await this.taskService.autoSkipOverdueTasks();

      if (result.skipped > 0) {
        console.log(`✓ Auto-skipped ${result.skipped} overdue task(s)`);
      }
    } catch (error) {
      console.error('Failed to auto-skip overdue tasks:', error);
    } finally {
      this.isRunning = false;
    }
  }
}

export const taskAutoSkipScheduler = new TaskAutoSkipScheduler();