import { z } from 'zod';

export const createReminderSchema = z.object({
  taskId: z.string().optional(),
  remindAt: z.string().datetime(),
});

export const updateReminderSchema = z.object({
  remindAt: z.string().datetime().optional(),
  sent: z.boolean().optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;