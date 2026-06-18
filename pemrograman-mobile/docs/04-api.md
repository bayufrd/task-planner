# API Documentation - Smart Task Planner Mobile

## Base URL

```
Production: https://taskplanner.dastrevas.com/api
Development: http://localhost:8000/api
```

## Authentication

All API requests require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```typescript
interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}
```

### Error Response
```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
}
```

## Endpoints

### 1. Authentication

#### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/google
Google OAuth authentication.

**Request:**
```json
{
  "idToken": "google_id_token_string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2. Tasks

#### GET /tasks
Get all tasks for the authenticated user.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | all | Filter by status: PENDING, DONE, SKIPPED |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task123",
      "title": "Submit Report",
      "description": "Complete Q4 financial report",
      "deadline": "2025-06-20T14:00:00Z",
      "priority": "HIGH",
      "estimatedDuration": 60,
      "difficulty": "medium",
      "status": "PENDING",
      "priorityScore": 85.5,
      "tags": ["work", "urgent"],
      "createdAt": "2025-06-15T10:00:00Z",
      "updatedAt": "2025-06-15T10:00:00Z"
    }
  ]
}
```

#### GET /tasks/:id
Get a specific task by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "task123",
    "title": "Submit Report",
    ...
  }
}
```

#### POST /tasks
Create a new task.

**Request:**
```json
{
  "title": "Submit Report",
  "description": "Complete Q4 financial report",
  "deadline": "2025-06-20T14:00:00Z",
  "priority": "HIGH",
  "estimatedDuration": 60,
  "difficulty": "medium",
  "tags": ["work", "urgent"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "task123",
    "title": "Submit Report",
    ...
  }
}
```

#### PATCH /tasks/:id
Update an existing task.

**Request (partial update):**
```json
{
  "title": "Updated Title",
  "status": "DONE"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

#### PATCH /tasks/:id/status
Update task status only.

**Request:**
```json
{
  "status": "DONE"
}
```

**Valid Status Values:** `PENDING`, `DONE`, `SKIPPED`

#### DELETE /tasks/:id
Soft delete a task.

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### 3. Statistics

#### GET /tasks/stats
Get task statistics summary.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pending": 5,
    "done": 12,
    "skipped": 3
  }
}
```

#### GET /tasks/stats/daily
Get daily task completion stats.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 30 | Number of days to fetch |

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "date": "2025-06-15", "count": 3 },
    { "date": "2025-06-16", "count": 5 },
    { "date": "2025-06-17", "count": 2 }
  ]
}
```

#### GET /tasks/stats/weekly
Get weekly task completion stats.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| weeks | number | 12 | Number of weeks to fetch |

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "week": "2025-W24", "count": 18 },
    { "week": "2025-W25", "count": 22 }
  ]
}
```

---

### 4. AI & Overview

#### GET /ai/overview
Get AI-generated overview analysis.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "score": 78,
    "level": "eagle",
    "insights": [
      "You've completed 85% of your tasks this week",
      "Consider breaking down large tasks"
    ],
    "advice": [
      { "title": "Focus on High Priority", "description": "..." },
      { "title": "Time Management", "description": "..." }
    ]
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH001 | 401 | Invalid or expired token |
| AUTH002 | 401 | Token not provided |
| AUTH003 | 403 | Insufficient permissions |
| TASK001 | 404 | Task not found |
| TASK002 | 400 | Invalid task data |
| TASK003 | 400 | Cannot update completed task |
| SYS001 | 500 | Internal server error |

## Rate Limiting

- Default: 100 requests per minute
- Auth endpoints: 10 requests per minute
- Response headers include rate limit info

## Mobile-Specific Considerations

### Token Storage
- JWT stored in AsyncStorage via Zustand persist
- Token included in all API requests via Axios interceptor
- Auto-refresh handled by backend

### Offline Support
- React Query caches responses
- Stale data shown when offline
- Mutations queued for retry
