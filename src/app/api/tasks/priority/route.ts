/**
 * API Route for Priority Scheduling
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // TODO: Get all tasks and return with priority scores
    // const tasks = await prisma.task.findMany()
    // const prioritized = prioritizeTasks(tasks)
    
    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch prioritized tasks' },
      { status: 500 }
    )
  }
}
