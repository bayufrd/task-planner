# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Task Planner Vue frontend >> can register, login, create task, and test ai parsing
- Location: tests/app.spec.ts:37:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Full Name')

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - navigation [ref=e6]:
    - generic [ref=e7]:
      - link "TaskPlanner Logo" [ref=e8] [cursor=pointer]:
        - /url: /
        - img "TaskPlanner Logo" [ref=e10]
      - button "Toggle theme" [ref=e11] [cursor=pointer]:
        - img [ref=e12]
  - generic [ref=e16]:
    - generic [ref=e17]:
      - img "TaskPlanner Logo" [ref=e20]
      - generic [ref=e21]:
        - heading "Create Account" [level=1] [ref=e22]
        - paragraph [ref=e23]: Join TaskPlanner to start planning smarter
    - generic [ref=e24]:
      - button "Sign In" [ref=e25] [cursor=pointer]
      - button "Sign Up" [ref=e26] [cursor=pointer]
    - generic [ref=e27]:
      - generic [ref=e28]:
        - text: Full Name
        - generic [ref=e29]:
          - img [ref=e31]
          - textbox "Enter your full name" [ref=e34]
      - generic [ref=e35]:
        - text: Email Address
        - generic [ref=e36]:
          - img [ref=e38]
          - textbox "you@example.com" [ref=e41]
      - generic [ref=e42]:
        - text: Password
        - generic [ref=e43]:
          - img [ref=e45]
          - textbox "Enter your password" [ref=e48]
      - button "Create Account" [disabled] [ref=e49]:
        - generic [ref=e50]: Create Account
        - img [ref=e51]
    - generic [ref=e57]: Or continue with
    - button "Continue with Google" [ref=e58] [cursor=pointer]:
      - img [ref=e59]
      - generic [ref=e64]: Continue with Google
    - generic [ref=e65]:
      - heading "What You Get" [level=3] [ref=e66]
      - list [ref=e67]:
        - listitem [ref=e68]:
          - generic [ref=e69]: ✓
          - generic [ref=e70]: AI-powered task creation & prioritization
        - listitem [ref=e71]:
          - generic [ref=e72]: ✓
          - generic [ref=e73]: Real-time sync with Google Calendar
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
  34 |     await expect(page.getByRole('link', { name: /get started free|mulai gratis/i })).toBeVisible()
  35 |   })
  36 | 
  37 |   test('can register, login, create task, and test ai parsing', async ({ page }) => {
  38 |     await page.goto('/register')
> 39 |     await page.getByLabel('Full Name').fill(registerName)
     |                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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