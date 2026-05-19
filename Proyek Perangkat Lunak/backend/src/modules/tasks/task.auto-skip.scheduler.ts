import { env } from '../../config/env';
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

  private async sendWhatsappMessage(number: string, message: string): Promise<void> {
    if (!env.WHATSAPP_BOT_URL || !env.TOKEN_WHATSAPP) {
      return;
    }

    const response = await fetch(`${env.WHATSAPP_BOT_URL}/api/whatsapp/send-personal`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.TOKEN_WHATSAPP}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ number, message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send WhatsApp reminder: ${response.status} ${response.statusText}`);
    }
  }

  private async run() {
    if (this.isRunning) return;

    this.isRunning = true;

    try {
      const reminders = await this.taskService.processWhatsappDeadlineReminders();

      for (const reminder of reminders) {
        try {
          await this.sendWhatsappMessage(reminder.number, reminder.message);
          await this.taskService.markWhatsappReminderSent(reminder.taskId, reminder.type);
          console.log('[Task Reminder] WhatsApp reminder sent', {
            taskId: reminder.taskId,
            type: reminder.type,
            number: reminder.number,
          });
        } catch (error) {
          console.error('[Task Reminder] Failed to send WhatsApp reminder', {
            taskId: reminder.taskId,
            type: reminder.type,
            number: reminder.number,
            error,
          });
        }
      }

      const result = await this.taskService.autoSkipOverdueTasks();

      if (result.skippedNotifications.length > 0) {
        for (const item of result.skippedNotifications) {
          try {
            await this.sendWhatsappMessage(item.number, item.message);
            await this.taskService.markSkippedNotificationSent(item.taskId);
            console.log('[Task Reminder] SKIPPED notification sent', {
              taskId: item.taskId,
              number: item.number,
            });
          } catch (error) {
            console.error('[Task Reminder] Failed to send SKIPPED notification', {
              taskId: item.taskId,
              number: item.number,
              error,
            });
          }
        }
      }

      if (result.skipped > 0) {
        console.log('[Task Reminder] Auto-skipped overdue tasks', { skipped: result.skipped });
      }
    } catch (error) {
      console.error('Failed to process task scheduler:', error);
    } finally {
      this.isRunning = false;
    }
  }
}

export const taskAutoSkipScheduler = new TaskAutoSkipScheduler();