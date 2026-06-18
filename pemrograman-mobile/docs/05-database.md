# Database Schema - Backend Reference

> Note: This document describes the backend database schema. Mobile app interacts with data via REST API only.

## Schema Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                           Smart Task Planner DB                        │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────────────┐  │
│  │  User   │────▶│  Task   │────▶│ TaskTag  │     │  Reminder   │  │
│  └─────────┘     └─────────┘     └──────────┘     └─────────────┘  │
│       │               │                                       │      │
│       │               ▼                                       │      │
│       │          ┌──────────┐     ┌────────────┐               │      │
│       └────────▶│ Session  │     │  Overview  │◀──────────────┘      │
│                  └──────────┘     │  Analysis  │                      │
│                  └────────────┘     └────────────┘                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Tables

### User Table

```sql
CREATE TABLE User (
    id VARCHAR(25) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    whatsappNumber VARCHAR(20) UNIQUE,
    theme ENUM('light', 'dark') DEFAULT 'light',
    googleId VARCHAR(255) UNIQUE,
    avatarUrl TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_googleId ON User(googleId);
```

### Task Table

```sql
CREATE TABLE Task (
    id VARCHAR(25) PRIMARY KEY,
    userId VARCHAR(25) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP NOT NULL,
    priority ENUM('HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM',
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    estimatedDuration INT DEFAULT 60,
    status ENUM('PENDING', 'DONE', 'SKIPPED') DEFAULT 'PENDING',
    priorityScore DECIMAL(5,2),
    reminderSent BOOLEAN DEFAULT FALSE,
    completedAt TIMESTAMP NULL,
    deletedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE INDEX idx_task_userId ON Task(userId);
CREATE INDEX idx_task_status ON Task(status);
CREATE INDEX idx_task_deadline ON Task(deadline);
CREATE INDEX idx_task_user_status ON Task(userId, status);
```

### TaskTag Table

```sql
CREATE TABLE TaskTag (
    id VARCHAR(25) PRIMARY KEY,
    taskId VARCHAR(25) NOT NULL,
    tagName VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    FOREIGN KEY (taskId) REFERENCES Task(id) ON DELETE CASCADE
);

CREATE INDEX idx_taskTag_taskId ON TaskTag(taskId);
```

### Reminder Table

```sql
CREATE TABLE Reminder (
    id VARCHAR(25) PRIMARY KEY,
    userId VARCHAR(25) NOT NULL,
    taskId VARCHAR(25),
    type ENUM('DAILY', 'PER_TASK', 'DEADLINE', '1H', '24H') NOT NULL,
    remindAt TIMESTAMP NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    sentAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (taskId) REFERENCES Task(id) ON DELETE CASCADE
);

CREATE INDEX idx_reminder_userId ON Reminder(userId);
CREATE INDEX idx_reminder_taskId ON Reminder(taskId);
CREATE INDEX idx_reminder_remindAt ON Reminder(remindAt);
```

### Session Table

```sql
CREATE TABLE Session (
    id VARCHAR(25) PRIMARY KEY,
    userId VARCHAR(25) NOT NULL,
    token TEXT NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE INDEX idx_session_token ON Session(token(255));
CREATE INDEX idx_session_userId ON Session(userId);
```

### OverviewAnalysisCache Table

```sql
CREATE TABLE OverviewAnalysisCache (
    id VARCHAR(25) PRIMARY KEY,
    userId VARCHAR(25) UNIQUE NOT NULL,
    score INT,
    level VARCHAR(50),
    insights JSON,
    advice JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);
```

## Enums Reference

```typescript
// Priority
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

// Difficulty
type Difficulty = 'easy' | 'medium' | 'hard';

// Task Status
type TaskStatus = 'PENDING' | 'DONE' | 'SKIPPED';

// Reminder Type
type ReminderType = 'DAILY' | 'PER_TASK' | 'DEADLINE' | '1H' | '24H';

// Theme
type Theme = 'light' | 'dark';
```

## Mobile App TypeScript Types

```typescript
// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name?: string;
}

export type TaskStatus = "PENDING" | "DONE" | "SKIPPED";
export type TaskDifficulty = "easy" | "medium" | "hard";

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  difficulty: TaskDifficulty;
  estimatedDuration: number;
  status: TaskStatus;
  priorityScore?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  pending: number;
  done: number;
  skipped: number;
  total: number;
  completed: number;
  completionRate: number;
  streakDays: number;
}
```

## Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RELATIONSHIP DIAGRAM                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  User (1) ─────────────< Task (N)                                   │
│   │                         │                                        │
│   │  - id                  - id                                     │
│   │  - email               - userId (FK)                            │
│   │                         │                                        │
│   │                         ├──── TaskTag (N)                         │
│   │                         │                                        │
│   │                         │    - id                                │
│   │                         │    - taskId (FK)                       │
│   │                         │    - tagName                           │
│   │                         │                                        │
│   │                         └──── Reminder (N)                        │
│   │                              │                                   │
│   │                              - id                                │
│   │                              - userId (FK)                       │
│   │                              - taskId (FK, nullable)             │
│   │                                                                     │
│   └─────────────────────────────── OverviewAnalysisCache (1)           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```
