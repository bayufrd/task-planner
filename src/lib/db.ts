/**
 * Database Utilities
 * Helper functions for database operations
 */

import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to database')
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }
}

export async function disconnectDB() {
  await prisma.$disconnect()
}
