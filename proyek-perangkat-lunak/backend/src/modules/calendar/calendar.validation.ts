import { z } from 'zod';

export const createCalendarSchema = z.object({
  calendarId: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string().default('personal'),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const updateCalendarSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isSynced: z.boolean().optional(),
});

export const syncCalendarSchema = z.object({
  calendarId: z.string(),
  taskIds: z.array(z.string()).optional(),
});

export type CreateCalendarInput = z.infer<typeof createCalendarSchema>;
export type UpdateCalendarInput = z.infer<typeof updateCalendarSchema>;
export type SyncCalendarInput = z.infer<typeof syncCalendarSchema>;