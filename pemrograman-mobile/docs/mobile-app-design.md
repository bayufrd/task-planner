# Mobile App Design: Smart Study Planner

## Mobile Architecture

Aplikasi dibangun menggunakan **React Native** dengan **Expo SDK** untuk memastikan performa native dan kemudahan pengembangan.

*   **Navigation**: Expo Router (File-based routing).
*   **State**: Zustand (Global store) + React Query (Server state).
*   **Styling**: NativeWind (Tailwind CSS for Mobile).
*   **Storage**: AsyncStorage untuk persistensi token dan offline cache.

## Screen List

1.  **Splash Screen**: Loading awal dan pengecekan auth session.
2.  **Login/Register**: Autentikasi user.
3.  **Dashboard**: Ringkasan statistik (Total, Done, Streak).
4.  **Task List**: Daftar semua tugas aktif.
5.  **Create/Edit Task**: Form input tugas.
6.  **Daily Plan**: Jadwal otomatis berdasarkan Priority Engine.
7.  **Profile**: Pengaturan akun dan logout.

## Navigation Flow

```txt
(Root)
├── (Auth)
│   ├── Login
│   └── Register
└── (Main - Tabs)
    ├── Dashboard
    ├── Tasks
    ├── Daily Plan
    └── Profile
```

## State Management Flow

*   **Auth Store**: Menyimpan `user` profile dan `token`.
*   **Task Store**: Cache daftar tugas untuk akses cepat.
*   **Notification Store**: Status izin notifikasi dan log reminder.

## Offline Strategy

*   **AsyncStorage**: Menyimpan token JWT agar user tidak perlu login ulang.
*   **React Query Cache**: Menyimpan data tugas terakhir yang berhasil di-fetch sehingga tetap bisa dilihat saat offline.
*   **Optimistic Updates**: (Optional) Update UI sebelum API merespon untuk pengalaman yang lebih smooth.
