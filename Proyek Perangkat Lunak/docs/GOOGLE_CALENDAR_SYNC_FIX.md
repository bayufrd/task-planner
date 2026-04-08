## Google Calendar Sync - Problem & Solution

### 🔍 Problem Ditemukan
Task tidak ditambahkan ke Google Calendar karena:

1. **CommandPalette hanya menggunakan Zustand store lokal**
   - Saat user menambah task via command palette, hanya disimpan di memory
   - Tidak memanggil API `/api/tasks` yang seharusnya sync ke Google Calendar

2. **API endpoint sudah siap tapi tidak dipanggil**
   - `POST /api/tasks` sudah implement `createCalendarEvent()`
   - Tapi CommandPalette tidak memanggil endpoint ini

### ✅ Solusi Diterapkan

#### 1. Update CommandPalette (`src/components/command/CommandPalette.tsx`)
- Tambah `isLoading` state untuk UI feedback
- Saat user submit task, panggil `POST /api/tasks`
- Tunggu response dan tampilkan sync status
- Jika error, tampilkan pesan error yang jelas

```typescript
// Alur baru:
User ketik task → Submit → POST /api/tasks → Google Calendar → Response sync status
```

#### 2. Improve Error Logging (`src/app/api/tasks/route.ts`)
- Tambah detailed console logs untuk debug:
  - ✅ User session validation
  - 📝 Task validation
  - 🔄 Google Calendar sync attempt
  - ✅/❌ Sync result

#### 3. Test File Dibuat (`docs/GOOGLE_CALENDAR_TEST.js`)
- Test function untuk manual testing
- Bisa jalankan di browser console

### 🚀 Cara Test Sekarang

**Opsi 1: Gunakan Command Palette**
1. Ketik: `/add Test Task tomorrow 3pm HIGH`
2. Lihat notification: ✨ synced to Google Calendar
3. Cek Google Calendar - task harus muncul dalam 1 menit

**Opsi 2: Test via API (Browser Console)**
```javascript
// Copy-paste ini di browser console:
const result = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Task',
    deadline: new Date(Date.now() + 24*60*60*1000).toISOString(),
    priority: 'HIGH'
  })
})
const data = await result.json()
console.log(data)
```

**Opsi 3: Load test file langsung**
```javascript
// Buka DevTools (F12) → Console
// Copy-paste semua code dari docs/GOOGLE_CALENDAR_TEST.js
testCreateTask()  // Buat task & sync
testGetCalendarEvents()  // Ambil events
```

### 📋 Checklist Before Production

- [ ] User sudah login dengan Google OAuth
- [ ] Google OAuth tokens tersimpan di session (bisa cek di Network tab → auth/callback)
- [ ] GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET valid di .env
- [ ] Database setup (Prisma migrations run)
- [ ] Test create task via Command Palette
- [ ] Verifikasi event muncul di Google Calendar
- [ ] Check browser console untuk detailed logs

### 🔧 Debug Tips

1. **Buka DevTools (F12) → Console**
   - Cek logs dari CommandPalette (akan print di console saat submit)

2. **Cek Network Tab**
   - POST /api/tasks request
   - Lihat response body untuk sync status

3. **Lihat Server Logs (terminal)**
   ```
   ✅ User session found: user-id-123
   📝 Creating task: Test Task
   🔄 Attempting Google Calendar sync...
   ✅ Google Calendar sync successful: event-id-456
   ```

4. **Jika Error:**
   - Check .env credentials
   - Verify user sudah login (check session)
   - Check Google Cloud Console permissions
   - Test token masih valid (refresh jika perlu)

### 🎯 Next Steps

1. Implement database CRUD (uncomment TODO di POST endpoint)
2. Setup database migrations
3. Test dengan real Google Calendar
4. Monitor sync failures dan implement retry logic
5. Add batch sync untuk existing tasks
