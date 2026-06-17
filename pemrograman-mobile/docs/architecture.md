# System Architecture: Smart Task Planner

## High Level Architecture

```txt
[ Mobile App (Expo) ]    [ Web App (Next.js) ]
          │                       │
          └───────────┬───────────┘
                      ▼
              [ Nginx Reverse Proxy ]
                      │
              [ Express.js Backend ]
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    [ MySQL DB ]          [ 9Router AI Proxy ]
          │                       │
          └───────────────────────┘
```

## Sequence Diagrams

### 1. Authentication (Login)
```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant DB

    User->>Client: Input Email & Password
    Client->>API: POST /auth/login
    API->>DB: Find User by Email
    DB-->>API: User Data & Hash
    API->>API: Verify Password
    API-->>Client: JWT Token & User Profile
    Client->>Client: Save Token to Storage
```

### 2. Create Task & Priority Calculation
```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant PriorityEngine
    participant DB

    User->>Client: Create Task Form
    Client->>API: POST /tasks
    API->>PriorityEngine: calculatePriorityScore(factors)
    PriorityEngine-->>API: Score (e.g. 85)
    API->>DB: Save Task with Score
    DB-->>API: Task Created
    API-->>Client: Success Response
```

### 3. Daily Schedule Generation
```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant DB

    User->>Client: Open Daily Plan
    Client->>API: GET /tasks?status=PENDING
    API->>DB: Fetch Pending Tasks
    DB-->>API: List of Tasks
    API->>API: Sort by Priority Score & Deadline
    API-->>Client: Ordered Schedule
```

### 4. Notification Trigger (WhatsApp/Local)
```mermaid
sequenceDiagram
    participant Scheduler
    participant API
    participant DB
    participant WA_Gateway

    Scheduler->>API: Run processDeadlineReminders()
    API->>DB: Find Tasks due in 1h/24h
    DB-->>API: Task List
    API->>WA_Gateway: Send Message
    API->>DB: Mark reminderSent = true
```
