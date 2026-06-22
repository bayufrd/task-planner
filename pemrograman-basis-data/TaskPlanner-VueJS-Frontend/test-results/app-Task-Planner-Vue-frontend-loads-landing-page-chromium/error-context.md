# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Task Planner Vue frontend >> loads landing page
- Location: tests/app.spec.ts:31:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /get started/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: /get started/i })

```

```yaml
- banner:
  - link "Go to home":
    - /url: /
    - img "Smart Task Planner"
  - navigation:
    - link "Features":
      - /url: "#features"
    - link "Pricing":
      - /url: "#pricing"
  - button "ID"
  - button "EN"
  - button:
    - img
  - link "SIGN IN":
    - /url: /auth/signin
- img
- text: AI assistant for smarter daily planning
- heading "Plan smarter finish faster" [level=1]
- paragraph: Smart Task Planner helps you capture tasks, organize priorities, manage reminders, and stay focused with AI-powered assistance built for modern daily productivity.
- link "SIGN IN":
  - /url: /auth/signin
  - text: SIGN IN
  - img
- button "View demo":
  - img
  - text: View demo
- text: 98% Task Completion 2hr+ Time Saved 50k+ Active Users 4.9/5 Satisfaction
- img
- text: AI Analysis in progress... Optimizing your daily schedule
- heading "Built for clarity" [level=2]
- paragraph: Everything you need to turn busy schedules into clear priorities, organized plans, and consistent progress.
- img
- heading "AI priority ranking" [level=3]
- paragraph: Highlight the work that matters most with helpful insights, progress snapshots, and a clearer execution path.
- img
- heading "Calendar-friendly scheduling" [level=3]
- paragraph: Stay on top of time blocks, reminders, and upcoming deadlines from a clean planning experience that feels focused.
- img
- heading "Natural language task parsing" [level=3]
- paragraph: Turn simple everyday instructions into structured task drafts so planning feels faster, easier, and more natural.
- heading "Plan tasks faster and stay focused every day" [level=2]
- paragraph: Smart Task Planner helps anyone organize work, set priorities, and manage daily plans with less effort.
- link "Try it free":
  - /url: /auth/signup
  - text: Try it free
  - img
- contentinfo:
  - img "Smart Task Planner"
  - text: TaskPlanner
  - paragraph: Smart Task Planner helps everyone organize tasks, plan daily priorities, and stay productive with a simpler workflow.
  - link "Twitter":
    - /url: "#"
  - link "GitHub":
    - /url: "#"
  - link "Discord":
    - /url: "#"
  - text: © 2024 Smart Task Planner. All rights reserved.
```

# Test source

```ts
  1  | /// <reference types="node" />
  2  | 
  3  | import { test, expect } from '@playwright/test'
  4  | 
  5  | const apiBase = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  6  | const basePassword = process.env.VITE_E2E_TEST_PASSWORD || 'secret123'
  7  | const baseName = process.env.VITE_E2E_TEST_NAME || 'E2E Test User'
  8  | const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  9  | const registerEmail = `e2e-${uniqueId}@example.com`
  10 | const registerName = `${baseName} ${uniqueId}`
  11 | const taskTitle = `E2E Task ${uniqueId}`
  12 | const parsedTaskTitle = `Parsed ${taskTitle}`
  13 | const parsePrompt = `Tomorrow 9 AM create task ${parsedTaskTitle} for 90 minutes urgent`
  14 | 
  15 | async function loginViaApi(email: string, password: string) {
  16 |   const response = await fetch(`${apiBase}/auth/login`, {
  17 |     method: 'POST',
  18 |     headers: { 'Content-Type': 'application/json' },
  19 |     body: JSON.stringify({ email, password }),
  20 |   })
  21 | 
  22 |   if (!response.ok) {
  23 |     throw new Error(`Failed to login test user: ${response.status}`)
  24 |   }
  25 | 
  26 |   return response.json()
  27 | }
  28 | 
  29 | test.describe('Task Planner Vue frontend', () => {
  30 | 
  31 |   test('loads landing page', async ({ page }) => {
  32 |     await page.goto('/')
  33 |     await expect(page.getByRole('heading', { name: /plan smarter/i })).toBeVisible()
> 34 |     await expect(page.getByRole('link', { name: /get started/i })).toBeVisible()
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  35 |   })
  36 | 
  37 |   test('can register, login, create task, and test ai parsing', async ({ page }) => {
  38 |     await page.goto('/register')
  39 |     await page.getByLabel('Name').fill(registerName)
  40 |     await page.getByLabel('Email').fill(registerEmail)
  41 |     await page.getByLabel('Password').fill(basePassword)
  42 |     await page.getByRole('button', { name: /create account/i }).click()
  43 |     await expect(page).toHaveURL(/dashboard/)
  44 |     await expect(page.getByRole('heading', { name: /task execution overview/i })).toBeVisible()
  45 | 
  46 |     await page.getByLabel('Title').fill(taskTitle)
  47 |     await page.getByLabel('Description').fill('Created by Playwright E2E flow')
  48 |     await page.getByLabel('Priority').selectOption('HIGH')
  49 |     await page.getByLabel('Status').selectOption('TODO')
  50 |     await page.getByLabel(/Estimated duration/i).fill('90')
  51 |     const createTaskResponse = page.waitForResponse((response) => response.url().includes('/tasks') && response.request().method() === 'POST')
  52 |     await page.getByRole('button', { name: /create task/i }).click()
  53 |     expect((await createTaskResponse).ok()).toBeTruthy()
  54 |     await expect(page.locator('table').getByText(taskTitle)).toBeVisible()
  55 | 
  56 |     await page.getByRole('button', { name: /logout/i }).click()
  57 |     await expect(page).toHaveURL(/login/)
  58 | 
  59 |     await page.getByLabel('Email').fill(registerEmail)
  60 |     await page.getByLabel('Password').fill(basePassword)
  61 |     await page.getByRole('button', { name: /sign in/i }).click()
  62 |     await expect(page).toHaveURL(/dashboard/)
  63 |     await expect(page.locator('table').getByText(taskTitle)).toBeVisible()
  64 | 
  65 |     const loginPayload = await loginViaApi(registerEmail, basePassword)
  66 |     const token = loginPayload?.data?.token
  67 |     await page.evaluate((nextToken) => {
  68 |       localStorage.setItem('taskplanner_token', nextToken)
  69 |     }, token)
  70 | 
  71 |     await page.goto('/ai-assistant')
  72 |     await expect(page.getByRole('heading', { name: /ai helper/i })).toBeVisible()
  73 |     await page.getByLabel('Natural language input').fill(parsePrompt)
  74 |     await page.getByRole('button', { name: /parse task/i }).click()
  75 |     await expect(page.getByRole('button', { name: /create parsed task/i })).toBeVisible({ timeout: 15000 })
  76 |     await expect(page.getByLabel('Title')).toHaveValue(parsedTaskTitle)
  77 |     const createParsedTaskResponse = page.waitForResponse((response) => response.url().includes('/tasks') && response.request().method() === 'POST')
  78 |     await page.getByRole('button', { name: /create parsed task/i }).click()
  79 |     expect((await createParsedTaskResponse).ok()).toBeTruthy()
  80 |     await page.goto('/dashboard')
  81 |     await expect(page.getByText(parsedTaskTitle).first()).toBeVisible()
  82 |   })
  83 | })
  84 | 
```