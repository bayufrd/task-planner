import { env } from '../../config/env';
import { TaskService } from './task.service';

const AUTO_SKIP_INTERVAL_MS = 60 * 1000;
const DAILY_SCHEDULE_HOUR_WIB = 6;

export class TaskAutoSkipScheduler {
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private lastDailyScheduleKey: string | null = null;
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

  private async sendWhatsappMediaMessage(
    number: string,
    media: { type: 'image'; url: string; caption: string },
  ): Promise<void> {
    if (!env.WHATSAPP_BOT_URL || !env.TOKEN_WHATSAPP) {
      return;
    }

    const response = await fetch(`${env.WHATSAPP_BOT_URL}/api/whatsapp/send-personal`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.TOKEN_WHATSAPP}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ number, media }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send WhatsApp media reminder: ${response.status} ${response.statusText}`);
    }
  }

  private getJakartaScheduleWindow(referenceDate: Date = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(referenceDate)
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, part.value]),
    ) as Record<string, string>;

    return {
      dayKey: `${parts.year}-${parts.month}-${parts.day}`,
      hour: Number(parts.hour),
      minute: Number(parts.minute),
    };
  }

  private async run() {
    if (this.isRunning) return;

    this.isRunning = true;

    try {
      const scheduleWindow = this.getJakartaScheduleWindow();
      if (
        scheduleWindow.hour === DAILY_SCHEDULE_HOUR_WIB
        && this.lastDailyScheduleKey !== scheduleWindow.dayKey
      ) {
        const dailyReminders = await this.taskService.processDailyScheduleReminder();

        for (const reminder of dailyReminders) {
          try {
            await this.sendWhatsappMediaMessage(reminder.number, reminder.media);
            await this.taskService.markDailyScheduleReminderSent(reminder.reminderKey, reminder.userId);
            console.log('[Daily Schedule Reminder] WhatsApp reminder sent', {
              reminderKey: reminder.reminderKey,
              userId: reminder.userId,
              number: reminder.number,
            });
          } catch (error) {
            console.error('[Daily Schedule Reminder] Failed to send WhatsApp reminder', {
              reminderKey: reminder.reminderKey,
              userId: reminder.userId,
              number: reminder.number,
              error,
            });
          }
        }

        this.lastDailyScheduleKey = scheduleWindow.dayKey;
      }

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