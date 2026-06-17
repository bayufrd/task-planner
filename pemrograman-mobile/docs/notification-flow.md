# Notification Flow: Mobile & WhatsApp

## Push Notification Flow (Mobile)

Sistem menggunakan **Expo Notifications** untuk pengingat lokal di perangkat.

1.  **Daily Reminder**: Setiap pagi jam 07:00, sistem mengirimkan ringkasan tugas hari ini.
2.  **Deadline Reminder**:
    *   **H-1**: Pengingat 24 jam sebelum deadline.
    *   **H-1 Jam**: Pengingat kritis sebelum deadline.
3.  **Task Reminder**: Notifikasi berdasarkan `reminderTime` yang diatur user pada tiap tugas.

## WhatsApp Notification Flow (Backend Triggered)

Backend menjalankan cron job untuk mengirim pesan via WhatsApp Gateway:

```txt
[ Backend Cron ]
      │
      ▼
[ Check Tasks ] ─── (Deadline in 1h/24h?) ───► [ Send WA Message ]
      │
      ▼
[ Check Daily ] ─── (Is it 07:00 AM?) ───► [ Send Daily Schedule Image ]
```

## Notification Logic

*   **Trigger**: Berdasarkan kolom `deadline` dan `reminderTime` di tabel Task.
*   **Deduplication**: Menggunakan kolom `reminderSent`, `reminder24hSent`, dll. untuk memastikan user tidak menerima pesan ganda.
