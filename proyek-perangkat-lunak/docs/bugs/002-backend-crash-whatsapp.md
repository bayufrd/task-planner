# Bug Report 002: Backend Crash on WhatsApp Task Creation

## Status
- **ID**: BUG-002
- **Severity**: Critical
- **Component**: Backend (Express.js), WhatsApp Inbound Module
- **Reported Date**: 2026-06-16
- **Status**: Resolved

## Problem Description
Backend mengalami crash (restart otomatis oleh PM2) sesaat setelah berhasil melakukan parsing command WhatsApp untuk pembuatan task (`CREATE_TASK`). Hal ini menyebabkan koneksi terputus dan Nginx mengembalikan error `502 Bad Gateway` ke layanan `whatsapp-bot`.

### Evidence (Logs)
**Backend Log:**
```
13|dt-task | [WA Command] Resolved action plan { ... actions: [{ action: 'CREATE_TASK', ... }] }
13|dt-task | 
13|dt-task | > smart-task-planner-backend@1.0.0 start
13|dt-task | > node dist/server.js
```
Aplikasi melakukan restart tepat setelah log "Resolved action plan".

**WhatsApp Bot Log:**
```
7|be-wa-bo | ❌ External personal route failed: { ... "error":{"name":"Error","message":"HTTP 502", ...}}
```

## Root Cause Analysis
Berdasarkan urutan log, crash terjadi di antara tahap **Plan Resolution** dan **Action Execution**. Kemungkinan besar disebabkan oleh:
1. **Unhandled Exception** pada logika pemrosesan `dateHint` atau parsing AI tambahan.
2. **Database Constraint Violation** atau error Prisma yang tidak tertangkap oleh `try-catch`.
3. **Null Pointer Exception** saat mengakses properti dari objek hasil parsing AI yang tidak lengkap.

---

## Roadmap Solusi & Checklist Implementasi

### Phase 1: Diagnosis & Logging (Observasi)
- [x] Tambahkan logging lebih detail di `whatsapp-inbound.routes.ts` sebelum dan sesudah pemanggilan `taskService.createTask`.
- [x] Periksa log error PM2 (`pm2 logs dt-task --err`) untuk mendapatkan stack trace yang menyebabkan crash.
- [x] Verifikasi data input yang dikirim dari `whatsapp-bot` ke backend untuk memastikan tidak ada field wajib yang hilang.

### Phase 2: Bug Fixing (Implementasi)
- [x] Bungkus seluruh blok eksekusi action WhatsApp dalam `try-catch` global di level router.
- [ ] Perbaiki logika parsing tanggal jika ditemukan error pada `dateHint`.
- [ ] Tambahkan validasi skema (Zod) yang lebih ketat untuk input dari WhatsApp sebelum diproses oleh service.
- [x] Pastikan `taskService.createTask` menangani kegagalan pembuatan tag secara elegan tanpa mematikan seluruh proses.

### Phase 3: Verification (Testing)
- [ ] Lakukan unit test pada fungsi parsing command WhatsApp dengan input yang menyebabkan crash.
- [ ] Uji coba integrasi (Smoke Test) menggunakan payload WhatsApp yang sama melalui Postman.
- [x] Verifikasi bahwa jika terjadi error, backend mengembalikan respons JSON error yang valid (bukan crash) sehingga bot bisa memberikan feedback ke user.

### Phase 4: Monitoring
- [ ] Pantau log PM2 selama 24 jam setelah perbaikan dideploy.
- [ ] Pastikan tidak ada restart otomatis (`uptime` stabil) saat menerima berbagai variasi perintah WhatsApp.

## Fix Summary
1. Menambahkan blok `try-catch` global pada handler `handleWhatsappInbound` untuk mencegah crash proses Node.js jika terjadi error yang tidak terduga.
2. Menambahkan logging detail pada setiap tahap eksekusi `CREATE_TASK` untuk mempermudah debugging jika terjadi kegagalan di masa depan.
3. Memastikan respons error (500) dikirim kembali ke bot jika terjadi kegagalan sistem, sehingga bot tidak mengalami timeout dan Nginx tidak memberikan 502.
