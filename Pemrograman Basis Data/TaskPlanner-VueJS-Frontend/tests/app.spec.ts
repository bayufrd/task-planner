import { test, expect } from '@playwright/test'

const apiBase = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const email = process.env.VITE_E2E_TEST_EMAIL || 'e2e@example.com'
const password = process.env.VITE_E2E_TEST_PASSWORD || 'secret123'
const name = process.env.VITE_E2E_TEST_NAME || 'E2E Test User'

async function ensureUser() {
  const registerResponse = await fetch(`${apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })

  if (registerResponse.ok || registerResponse.status === 409) {
    return
  }

  throw new Error(`Failed to prepare E2E user: ${registerResponse.status}`)
}

test.describe('Task Planner Vue frontend', () => {
  test.beforeAll(async () => {
    await ensureUser()
  })

  test('loads landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /plan smarter/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible()
  })

  test('can login and open dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/dashboard/)
    await expect(page.getByRole('heading', { name: /task execution overview/i })).toBeVisible()
  })
})
