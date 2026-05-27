# Frontend Documentation

## Overview

Project ini adalah frontend SPA berbasis Vue 3 untuk backend Java Task Planner.

## Architecture

- [`src/router/index.ts`](../src/router/index.ts): routing dan auth guard
- [`src/stores/auth.ts`](../src/stores/auth.ts): JWT auth state
- [`src/stores/app.ts`](../src/stores/app.ts): task, reminder, planner, stats, AI state
- [`src/services/api.ts`](../src/services/api.ts): adapter semua endpoint backend
- [`src/views/DashboardPage.vue`](../src/views/DashboardPage.vue): dashboard utama
- [`src/views/RemindersPage.vue`](../src/views/RemindersPage.vue): reminder UI
- [`src/views/AiAssistantPage.vue`](../src/views/AiAssistantPage.vue): AI helper UI

## Implemented UI modules

### Auth
- register via `POST /auth/register`
- login via `POST /auth/login`
- fetch profile via `GET /auth/me`
- logout via `POST /auth/logout`

### Tasks dashboard
- list, create, update, delete task
- mark done
- skip task
- load task stats
- load daily stats
- load planner today

### Reminders
- create, list, update, delete reminder

### AI helper
- parse natural language into task draft
- overview analysis summary

## Non-goals

- Google OAuth
- theme switching
- multi-language support
- calendar sync UI
- WhatsApp inbound UI
