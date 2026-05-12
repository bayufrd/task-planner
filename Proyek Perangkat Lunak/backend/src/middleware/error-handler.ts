import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';
import { sendError } from '../lib/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      sendError(res, 'DUPLICATE_ENTRY', 'Resource already exists', 409);
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 'NOT_FOUND', 'Resource not found', 404);
      return;
    }
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    const zodError = err as any;
    sendError(res, 'VALIDATION_ERROR', 'Validation failed', 400, zodError.errors);
    return;
  }

  // Default error
  console.error('Unhandled error:', err);
  sendError(res, 'INTERNAL_SERVER_ERROR', 'Internal server error', 500);
};