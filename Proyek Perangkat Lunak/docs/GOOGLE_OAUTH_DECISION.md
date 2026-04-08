# 🧠 Google OAuth Approach - Decision Summary

## ✅ Final Decision: Google OAuth (Pendekatan 2)

### Alasan Dipilih:
1. **Multi-user yang proper** - Setiap user punya Google account sendiri
2. **Real-time sync** - Task langsung tertambah ke Google Calendar user
3. **Full permissions** - Create, Edit, Delete semua bisa
4. **Tidak ada offline access** - Konsepnya user menambah task → langsung sync (online)
5. **Production-ready** - Cocok untuk zero trust tunnel setup

---

## 📋 .env Variables yang Dibutuhkan

Hanya 3 variable saja (sudah cukup):

```env
# Authentication
NEXTAUTH_SECRET=generated_random_string
NEXTAUTH_URL=http://localhost:3000  (atau production URL)

# Google OAuth (dari Google Cloud Console)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

❌ **TIDAK perlu** `.env` variable untuk Google Calendar API Key yang shared
❌ **TIDAK perlu** offline access token
✅ **Hanya perlu** OAuth credentials + NextAuth secret

---

## 🔄 Flow yang Akan Terjadi

```
1. User klik "Login dengan Google"
   ↓
2. Redirect ke Google OAuth page (pakai CLIENT_ID)
   ↓
3. User input email & password di Google
   ↓
4. User authorize app (permission: calendar create/edit/delete)
   ↓
5. Google return access_token ke server (via CLIENT_SECRET)
   ↓
6. NextAuth encrypt token di session (pakai NEXTAUTH_SECRET)
   ↓
7. Token disimpan di database (Prisma Account table)
   ↓
8. User login ✅
   ↓
9. User create task di app
   ↓
10. App ambil access_token dari database
    ↓
11. App call Google Calendar API (create event)
    ↓
12. Task langsung muncul di Google Calendar user ✅
```

---

## 🎯 Google Calendar Permissions

**Scope yang digunakan:**
```
- openid
- profile  
- email
- https://www.googleapis.com/auth/calendar
```

Dengan `calendar` scope, app bisa:
✅ Create events
✅ Edit events
✅ Delete events
✅ Read user's calendar

---

## 🌐 Production Setup (Zero Trust Tunnel)

Saat deploy ke production server dengan zero trust tunnel:

1. **Google Cloud Console:**
   - Add authorized JavaScript origin: `https://your-tunnel.com`
   - Add redirect URI: `https://your-tunnel.com/api/auth/callback/google`

2. **Server .env:**
   ```env
   NEXTAUTH_URL=https://your-zero-trust-tunnel.com
   NEXTAUTH_SECRET=generated_new_secret_for_prod
   GOOGLE_CLIENT_ID=same_client_id
   GOOGLE_CLIENT_SECRET=same_client_secret
   ```

3. **Zero Trust Tunnel (Cloudflare):**
   ```bash
   cloudflared tunnel run app-name --url http://localhost:3000
   ```

---

## 📊 Comparison: Pendekatan 1 vs 2

| Aspek | Pendekatan 1 (.env Key) | Pendekatan 2 (OAuth) ✅ |
|-------|---|---|
| Multi-user | ❌ Hanya 1 user | ✅ Unlimited users |
| Per-user calendar | ❌ Shared 1 calendar | ✅ Setiap user punya sendiri |
| API key di .env | ✅ Ada | ❌ Tidak ada (lebih aman) |
| Offline access | ✅ Selalu bisa | ❌ Hanya online (sesuai konsep) |
| Real-time sync | ✅ Bisa | ✅ Bisa (lebih baik) |
| Security | ❌ API key terekspos | ✅ Token encrypted |
| Production-ready | ⚠️ Tidak recommended | ✅ Recommended |

---

## 🚀 Next Steps

1. Setup Google Cloud Project + OAuth credentials
2. Create NextAuth route handler
3. Update Prisma schema (add Account/Session models)
4. Create Google Calendar sync utility
5. Create Task API endpoints
6. Test locally
7. Deploy to production

**Dokumentasi lengkap:** `docs/GOOGLE_OAUTH_SETUP.md`
