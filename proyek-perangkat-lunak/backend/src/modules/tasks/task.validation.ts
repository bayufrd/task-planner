import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  deadline: z.string().datetime('Invalid deadline format'),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  estimatedDuration: z.number().int().positive().optional(),
  reminderTime: z.number().int().positive().default(60),
  tags: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  estimatedDuration: z.number().int().positive().optional(),
  reminderTime: z.number().int().positive().optional(),
  status: z.enum(['PENDING', 'DONE', 'SKIPPED']).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['PENDING', 'DONE', 'SKIPPED']),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;