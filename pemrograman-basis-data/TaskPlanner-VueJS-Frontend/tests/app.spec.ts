/// <reference types="node" />

import { test, expect } from '@playwright/test'

const apiBase = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const basePassword = process.env.VITE_E2E_TEST_PASSWORD || 'secret123'
const baseName = process.env.VITE_E2E_TEST_NAME || 'E2E Test User'
const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const registerEmail = `e2e-${uniqueId}@example.com`
const registerName = `${baseName} ${uniqueId}`
const taskTitle = `E2E Task ${uniqueId}`
const parsedTaskTitle = `Parsed ${taskTitle}`
const parsePrompt = `Tomorrow 9 AM create task ${parsedTaskTitle} for 90 minutes urgent`

async function loginViaApi(email: string, password: string) {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(`Failed to login test user: ${response.status}`)
  }

  return response.json()
}

test.describe('Task Planner Vue frontend', () => {

  test('loads landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /plan smarter/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible()
  })

  test('can register, login, create task, and test ai parsing', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel('Name').fill(registerName)
    await page.getByLabel('Email').fill(registerEmail)
    await page.getByLabel('Password').fill(basePassword)
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/dashboard/)
    await expect(page.getByRole('heading', { name: /task execution overview/i })).toBeVisible()

    await page.getByLabel('Title').fill(taskTitle)
    await page.getByLabel('Description').fill('Created by Playwright E2E flow')
    await page.getByLabel('Priority').selectOption('HIGH')
    await page.getByLabel('Status').selectOption('TODO')
    await page.getByLabel(/Estimated duration/i).fill('90')
    const createTaskResponse = page.waitForResponse((response) => response.url().includes('/tasks') && response.request().method() === 'POST')
    await page.getByRole('button', { name: /create task/i }).click()
    expect((await createTaskResponse).ok()).toBeTruthy()
    await expect(page.locator('table').getByText(taskTitle)).toBeVisible()

    await page.getByRole('button', { name: /logout/i }).click()
    await expect(page).toHaveURL(/login/)

    await page.getByLabel('Email').fill(registerEmail)
    await page.getByLabel('Password').fill(basePassword)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/dashboard/)
    await expect(page.locator('table').getByText(taskTitle)).toBeVisible()

    const loginPayload = await loginViaApi(registerEmail, basePassword)
    const token = loginPayload?.data?.token
    await page.evaluate((nextToken) => {
      localStorage.setItem('taskplanner_token', nextToken)
    }, token)

    await page.goto('/ai-assistant')
    await expect(page.getByRole('heading', { name: /ai helper/i })).toBeVisible()
    await page.getByLabel('Natural language input').fill(parsePrompt)
    await page.getByRole('button', { name: /parse task/i }).click()
    await expect(page.getByRole('button', { name: /create parsed task/i })).toBeVisible({ timeout: 15000 })
    await expect(page.getByLabel('Title')).toHaveValue(parsedTaskTitle)
    const createParsedTaskResponse = page.waitForResponse((response) => response.url().includes('/tasks') && response.request().method() === 'POST')
    await page.getByRole('button', { name: /create parsed task/i }).click()
    expect((await createParsedTaskResponse).ok()).toBeTruthy()
    await page.goto('/dashboard')
    await expect(page.getByText(parsedTaskTitle).first()).toBeVisible()
  })
})
