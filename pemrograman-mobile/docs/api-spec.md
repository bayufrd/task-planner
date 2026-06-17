# API Specification (OpenAPI-like)

## Base URL
`https://taskplanner.dastrevas.com/api`

## 1. Authentication

### POST /auth/register
*   **Request**: `{ email, password, name }`
*   **Response**: `201 Created` - `{ user: { id, email, name } }`

### POST /auth/login
*   **Request**: `{ email, password }`
*   **Response**: `200 OK` - `{ token, user: { id, email, name } }`

---

## 2. Tasks

### GET /tasks
*   **Query Params**: `status` (optional: PENDING, DONE, SKIPPED)
*   **Response**: `200 OK` - `Array<Task>`

### POST /tasks
*   **Request**: `{ title, description, deadline, priority, estimatedDuration, tags[] }`
*   **Response**: `201 Created` - `Task Object`

### PUT /tasks/:id
*   **Request**: Partial Task Object
*   **Response**: `200 OK` - `Updated Task Object`

### DELETE /tasks/:id
*   **Response**: `200 OK` - `{ message: "Task deleted successfully" }` (Soft Delete)

---

## 3. Dashboard & Stats

### GET /tasks/stats
*   **Response**: `200 OK` - `{ pending: 5, done: 10, skipped: 2 }`

### GET /tasks/stats/daily
*   **Query Params**: `days` (default: 30)
*   **Response**: `200 OK` - `Array<{ date, count }>`

---

## 4. AI & Overview

### GET /ai/overview
*   **Response**: `200 OK` - `{ score, insights: [], advice: [] }` (Cached analysis)
