# Testing Guide

## Environment

Frontend env examples are in [`.env.example`](../.env.example).
Local testing env is stored in [`.env`](../.env).

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_E2E_TEST_EMAIL=e2e@example.com
VITE_E2E_TEST_PASSWORD=secret123
VITE_E2E_TEST_NAME=E2E Test User
```

## Playwright setup

Install browser binaries:

```bash
npx playwright install
```

## Commands

```bash
npm run build
npm run test:e2e
npm run test:e2e:ui
```

## What the E2E test does

Test file: [`tests/app.spec.ts`](../tests/app.spec.ts:1)

- prepares a backend user through `POST /api/auth/register`
- opens landing page
- logs in through the Vue UI
- verifies redirect to dashboard

## Backend dependency

The Java backend must be running and reachable at [`VITE_API_BASE_URL`](../.env.example).
If backend auth or database is unavailable, the E2E preparation step will fail.
