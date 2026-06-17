# Business Flow: Smart Task Planner

## Authentication Flow

1.  **Register**: User mendaftar dengan email/nama -> Data disimpan di DB -> Redirect ke Login.
2.  **Login**: User input kredensial -> API validasi -> Generate JWT -> Simpan di LocalStorage/Cookie.
3.  **Logout**: Hapus token dari client-side storage -> Redirect ke Landing Page.

## Task Lifecycle

1.  **Creation**:
    *   User input detail tugas (Title, Deadline, Priority, Duration).
    *   System menghitung **Initial Priority Score**.
    *   Task disimpan dengan status `PENDING`.
2.  **Monitoring**:
    *   System secara berkala mengecek deadline.
    *   Trigger notifikasi pada H-24 jam, H-1 jam, dan saat Deadline tiba.
3.  **Execution**:
    *   User melihat urutan tugas di **Daily Plan** (diurutkan berdasarkan skor tertinggi).
    *   User mengubah status menjadi `DONE` setelah selesai.
4.  **Auto-Skip**:
    *   Jika tugas melewati deadline + toleransi durasi tanpa diselesaikan, status otomatis berubah menjadi `SKIPPED`.

## Adaptive Behavior Flow

```txt
[ User Action ]
      │
      ▼
[ Behavior Tracking ]
(Track: Completed on time? Skipped? Overdue?)
      │
      ▼
[ Priority Adjustment ]
(Future tasks might get higher urgency if user often skips)
      │
      ▼
[ Schedule Regeneration ]
(Daily plan updated in real-time)
```
