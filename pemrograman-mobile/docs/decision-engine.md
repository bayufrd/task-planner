# Decision Engine: Priority & Scheduling

## Rule Engine

Sistem menggunakan 4 faktor utama untuk menentukan urgensi sebuah tugas:

1.  **Urgency (40%)**: Berapa lama waktu tersisa hingga deadline.
2.  **Importance (35%)**: Level prioritas yang ditentukan user (HIGH/MEDIUM/LOW).
3.  **Reminder Signal (15%)**: Kedekatan waktu pengingat.
4.  **Estimated Duration (10%)**: Beban waktu tugas.

## Priority Formula (Actual Code)

Berdasarkan implementasi di `backend/src/utils/priority.ts`:

```typescript
const totalScore = 
    urgencyScore * 0.4 + 
    priorityScore * 0.35 + 
    reminderScore * 0.15 + 
    durationScore * 0.1;
```

### Urgency Score Mapping:
*   Overdue: 100
*   <= 2 jam: 90
*   <= 6 jam: 80
*   <= 24 jam: 60
*   <= 3 hari: 40
*   <= 7 hari: 20
*   Lainnya: 10

### Importance Score Mapping:
*   HIGH: 100
*   MEDIUM: 60
*   LOW: 30

## Scheduling Algorithm

Algoritma penjadwalan menggunakan pendekatan **Greedy Priority-First**:

1.  Ambil semua tugas dengan status `PENDING`.
2.  Hitung skor prioritas terbaru untuk setiap tugas (karena faktor Urgency berubah seiring waktu).
3.  Urutkan berdasarkan:
    *   **Primary**: Priority Score (Descending).
    *   **Secondary**: Deadline (Ascending).
4.  Tampilkan dalam daftar **Daily Plan**.

## Auto-Skip Logic

Tugas akan otomatis dianggap `SKIPPED` jika:
`Waktu Sekarang > Deadline + max(EstimatedDuration, 60 menit)`
Hal ini memastikan daftar tugas tetap bersih dari tugas masa lalu yang tidak relevan.
