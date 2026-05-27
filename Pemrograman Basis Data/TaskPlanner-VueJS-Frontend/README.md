# Task Planner VueJS Frontend

Frontend Vue 3 + Vite untuk backend Java Spring Boot pada [`TaskPlanner-Java-Backend`](../TaskPlanner-Java-Backend/README.md).

## Scope

Frontend ini menyesuaikan implementasi backend yang ada di [`docs/API_ENDPOINTS.md`](../TaskPlanner-Java-Backend/docs/API_ENDPOINTS.md) dan referensi tampilan dari project Next.js di [`../../Proyek Perangkat Lunak`](../../Proyek%20Perangkat%20Lunak).

Penyesuaian utama:
- hanya memakai auth email/password JWT
- tidak ada Google Auth
- tidak ada dark/light switch
- tidak ada multi-language
- default UI English

## Features

- Landing page
- Register dan login
- Dashboard task
- Task stats dan chart
- Today planner
- Reminder management
- AI helper for parse task and overview analysis

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Default API base URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Build

```bash
npm run build
```

## Important routes

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/reminders`
- `/ai-assistant`

## Docs

- [`docs/FRONTEND_DOCUMENTATION.md`](./docs/FRONTEND_DOCUMENTATION.md)
- [`docs/ROADMAP_FRONTEND.md`](./docs/ROADMAP_FRONTEND.md)
- [`docs/API_ADAPTATION.md`](./docs/API_ADAPTATION.md)
