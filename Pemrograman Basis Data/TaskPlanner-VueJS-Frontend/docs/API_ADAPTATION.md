# API Adaptation Notes

Dokumen ini menjelaskan penyesuaian frontend Vue terhadap backend Java yang tersedia.

## Removed from Next.js reference

Karena backend Java saat ini belum menyediakan endpoint terkait, frontend Vue tidak mengimplementasikan:
- Google login
- Google callback flow
- auth sync session
- calendar sync
- WhatsApp internal route
- language switcher
- dark mode toggle

## Endpoint mapping

### Auth
- `POST /api/auth/register` -> register page
- `POST /api/auth/login` -> login page with specific auth error message handling
- `GET /api/auth/me` -> auth bootstrap
- `POST /api/auth/logout` -> header logout action

### Tasks
- `GET /api/tasks` -> dashboard list
- `POST /api/tasks` -> task create form
- `PUT /api/tasks/{id}` -> task update form
- `PATCH /api/tasks/{id}/status` -> status update helper
- `POST /api/tasks/{id}/complete` -> done action
- `POST /api/tasks/{id}/skip` -> skip action
- `DELETE /api/tasks/{id}` -> delete action
- `GET /api/tasks/stats` -> stat cards
- `GET /api/tasks/stats/daily` -> bar chart
- `GET /api/tasks/stats/weekly` -> prepared in store for future chart expansion
- `GET /api/tasks/priority/{level}` -> prepared adapter for future filtered board

### Planner
- `GET /api/planner/today` -> planner section

### Reminders
- `POST /api/reminders`
- `GET /api/reminders`
- `PATCH /api/reminders/{id}`
- `DELETE /api/reminders/{id}`

### AI
- `POST /api/ai/parse-task` -> AI helper input
- `POST /api/ai/overview-analysis` -> analysis panel

## Response handling

Frontend adapter menerima pola utama wrapper JSON `success/message/data`.

Untuk login, frontend sekarang menampilkan message backend yang lebih spesifik, misalnya:
- `Email is not registered`
- `Incorrect password`
- `Login failed due to a server error`

Jika backend tidak bisa dijangkau atau server belum berjalan, adapter request akan menampilkan pesan jaringan yang lebih jelas daripada raw `Failed to fetch`:
- `Unable to reach the backend server. Please check whether the API is running and reachable.`

Semua request ditangani di [`src/services/api.ts`](../src/services/api.ts).
