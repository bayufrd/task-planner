# Smart Task Planner - Quick Start Guide

## 🚀 Setelah `npm install` Selesai

Lakukan langkah-langkah ini dalam urutan:

### 1. Generate Prisma Client
```powershell
npm run prisma:generate
```

### 2. Setup Database
```powershell
npm run prisma:migrate
```

Ini akan membuat semua table di MySQL Anda.

### 3. Start Development Server
```powershell
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

---

## 📋 Checklist Setup

- [ ] npm install selesai (tunggu sampai selesai)
- [ ] npm run prisma:generate (generate client)
- [ ] npm run prisma:migrate (setup database)
- [ ] npm run dev (start dev server)
- [ ] Buka http://localhost:3000 di browser
- [ ] Tekan Ctrl+K untuk membuka command palette
- [ ] Coba add task: "add meeting tomorrow 3pm high"

---

## 🎯 Fitur untuk Dicoba

1. **Command Palette (Ctrl+K)**
   - Type: `add meeting tomorrow 3pm`
   - Task akan otomatis diprioritaskan

2. **Calendar View**
   - Klik tanggal untuk select
   - Lihat task count per hari

3. **Priority Scoring**
   - Lihat priority score di setiap task
   - Yang lebih tinggi = lebih urgent

4. **Dark Mode**
   - Klik moon icon di header
   - Theme tersimpan otomatis

5. **Task Actions**
   - Complete: Mark task sebagai done
   - Start: Mark sebagai in-progress
   - Delete: Remove task

---

## 🗂️ File Penting untuk Dimodify

| File | Purpose |
|------|---------|
| `src/lib/priorityScheduling.ts` | Adjust priority algorithm |
| `src/lib/store.ts` | Add more state actions |
| `prisma/schema.prisma` | Modify database schema |
| `src/components/**` | Edit UI components |
| `.env` | Update configuration |

---

## 🔗 Links & Resources

- **Main App**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **Docs**: `/README.md` (general), `/DEVELOPMENT.md` (setup), `/ARCHITECTURE.md` (design)

---

## ⚠️ Kalau Ada Error

1. **Port 3000 sudah dipakai?**
   ```powershell
   npm run dev -- -p 3001
   ```

2. **Database connection error?**
   - Cek MySQL running
   - Cek credentials di `.env`

3. **Module not found?**
   ```powershell
   npm install zustand
   npm install date-fns
   ```

4. **Prisma error?**
   ```powershell
   npm run prisma:generate
   ```

---

## 📞 Next Steps

Setelah development server berjalan:

1. **Tambah database integration** di `src/app/api/tasks/route.ts`
2. **Setup Google Auth** di `.env` + NextAuth
3. **Add reminders** menggunakan cron job
4. **Setup Google Calendar sync** dengan googleapis

Lihat `DEVELOPMENT.md` untuk detail lebih lanjut!

---

**Status**: ✅ Project siap untuk development!
