/**
 * Database Utilities
 * Helper functions for database operations
 */

export { prisma, default } from './index'

const prismaModule = require('./index')
const prisma = prismaModule.prisma

export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('Connected to database')
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }
}

export async function disconnectDB() {
  await prisma.$disconnect()
}
