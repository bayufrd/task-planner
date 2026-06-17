# Entity Relationship Diagram (ERD)

## Entity List

*   **User**: Menyimpan informasi profil pengguna, kredensial, dan pengaturan WhatsApp.
*   **Task**: Entitas utama tugas dengan deadline, prioritas, dan status.
*   **TaskTag**: Label kategori untuk tugas (1:N dengan Task).
*   **Reminder**: Log pengiriman notifikasi (harian atau per tugas).
*   **Calendar**: Sinkronisasi dengan Google Calendar.
*   **OverviewAnalysisCache**: Cache hasil analisis AI untuk dashboard.

## ERD Diagram

```mermaid
erDiagram
    USER ||--o{ TASK : creates
    USER ||--o{ ACCOUNT : has
    USER ||--o{ SESSION : has
    USER ||--o{ REMINDER : receives
    USER ||--o{ CALENDAR : syncs
    USER ||--o| OVERVIEW_ANALYSIS_CACHE : has

    TASK ||--o{ TASK_TAG : has
    TASK ||--o{ REMINDER : triggers

    USER {
        string id PK
        string email UK
        string name
        string password
        string whatsappNumber UK
        string theme
        datetime createdAt
    }

    TASK {
        string id PK
        string userId FK
        string title
        string description
        datetime deadline
        string priority
        int estimatedDuration
        string status
        boolean reminderSent
        datetime completedAt
        datetime deletedAt
    }

    TASK_TAG {
        string id PK
        string taskId FK
        string tagName
        string color
    }

    REMINDER {
        string id PK
        string userId FK
        string taskId FK
        datetime remindAt
        boolean sent
    }
```

## Data Dictionary (Core Tables)

### Table: User
| Field | Type | Description |
| --- | --- | --- |
| id | String (CUID) | Primary Key |
| email | String | Unique Email |
| whatsappNumber | String | For WA Notifications |
| password | String | Hashed Password |

### Table: Task
| Field | Type | Description |
| --- | --- | --- |
| id | String (CUID) | Primary Key |
| userId | String | Foreign Key to User |
| title | String | Task Title |
| deadline | DateTime | Due Date |
| priority | String | HIGH, MEDIUM, LOW |
| status | String | TODO, IN_PROGRESS, DONE, SKIPPED |
| deletedAt | DateTime | For Soft Delete |
