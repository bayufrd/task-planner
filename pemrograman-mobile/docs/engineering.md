# Engineering Documentation: Smart Task Planner

## Project Overview

*   **Tujuan Aplikasi**: Membantu mahasiswa dan profesional muda mengelola tugas secara cerdas dengan penentuan prioritas otomatis dan penjadwalan berbasis waktu.
*   **Problem Statement**: Banyak pengguna kesulitan menentukan tugas mana yang harus dikerjakan terlebih dahulu saat menghadapi banyak deadline yang berdekatan.
*   **Target User**: Mahasiswa, Pelajar, dan Profesional yang memiliki jadwal padat.
*   **Business Value**: Meningkatkan produktivitas melalui manajemen waktu yang terukur dan mengurangi stres akibat penumpukan tugas (deadline anxiety).

## System Architecture

*   **Frontend**: Aplikasi Web berbasis Next.js 14 (App Router) dan Aplikasi Mobile berbasis React Native (Expo).
*   **Backend**: RESTful API menggunakan Express.js dengan TypeScript.
*   **Database**: MySQL dikelola melalui Prisma ORM.
*   **Notification**: Integrasi WhatsApp (Inbound/Outbound) dan Local Push Notifications pada Mobile.
*   **Rule Engine**: Algoritma kalkulasi skor prioritas berdasarkan 4 faktor utama (Urgency, Importance, Reminder, Duration).

## Technology Stack

| Layer | Technology | Purpose |
| ----- | ---------- | ------- |
| **Frontend (Web)** | Next.js 14 | Server-side rendering dan UI utama |
| **Frontend (Mobile)** | React Native (Expo) | Aksesibilitas mobile dan notifikasi lokal |
| **Backend** | Express.js | Core logic, REST API, dan integrasi service |
| **Database** | MySQL | Penyimpanan data relasional |
| **ORM** | Prisma | Pemetaan objek ke database dan migrasi |
| **State Management** | Zustand | Manajemen state client-side yang ringan |
| **Validation** | Zod | Validasi skema data pada API dan form |
| **Authentication** | JWT & NextAuth | Keamanan akses dan integrasi Google OAuth |
| **AI Integration** | 9Router | Parsing perintah tugas berbasis bahasa alami |

## Folder Structure

```txt
proyek-perangkat-lunak/
├── backend/                # Express.js API source code
│   ├── prisma/             # Database schema & migrations
│   └── src/                # Backend logic (modules, services, utils)
├── src/                    # Next.js Frontend source code
│   ├── app/                # Next.js App Router pages
│   └── components/         # Reusable UI components
├── docs/                   # Technical documentation
└── pemrograman-mobile/     # React Native Expo Mobile App
    ├── src/app/            # Expo Router navigation
    └── src/services/       # Mobile API client
```

## Development Workflow

*   **Local Development**: Menggunakan `npm run dev` pada masing-masing folder (backend & frontend).
*   **Build Process**: Backend dikompilasi menggunakan `tsc`, Frontend Web menggunakan `next build`.
*   **Deployment Flow**: Menggunakan PM2 sebagai process manager dan Nginx sebagai Reverse Proxy.
*   **Environment Variables**: Menggunakan file `.env` untuk menyimpan `DATABASE_URL`, `JWT_SECRET`, dan API keys.

## Coding Standards

*   **Naming Convention**: camelCase untuk variabel/fungsi, PascalCase untuk Komponen/Class, kebab-case untuk file.
*   **Component Convention**: Functional components dengan Hooks.
*   **API Convention**: RESTful dengan standard response helper (success/error).
*   **Database Convention**: Snake_case untuk nama kolom di DB, dipetakan ke camelCase di Prisma.
