# Smart Task Planner - Mobile App Documentation

Complete technical documentation for the Smart Task Planner mobile application.

## Session Log

| Date | Agent | Changes |
|------|-------|---------|
| 2026-06-19 | Dastrevas Agent | Fixed iOS Google login to use native scheme redirect URI via `makeRedirectUri({scheme:'smart-task-planner'})` instead of Expo proxy (400 mismatch). Added `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`. Sent platform metadata to `/auth/google/mobile`. TypeScript check passed. |
| 2026-06-18 | Dastrevas Agent | Fixed login/logout by clearing all 3 storage keys (auth-storage, auth-token, user). Login now uses Zustand state for redirect check instead of separate AsyncStorage reads. |
| 2026-06-18 | Dastrevas Agent | Fixed logout by clearing both `auth-storage` (Zustand) and `auth-token` (API interceptor) from AsyncStorage. Added auth guard to main layout. Updated profile logout button with loading state and proper redirect using useEffect. |
| 2026-06-18 | Dastrevas Agent | Added `priorityScore` to getTasks/getTaskById responses. Updated dashboard.tsx task cards to show time remaining (overdue/left/days) and priority badge. Fixed TypeScript errors. Updated Task interface with priority field and tags format. |
| 2025-06-18 | Dastrevas Agent | Fixed `createTaskMutation` reference error in `new-task.tsx` (line 481) - changed to `taskMutation`. Created `TaskDetailModal.tsx` component showing full task details with Edit/Done/Delete actions. Modified `dashboard.tsx` to open detail modal on card tap instead of navigating directly to edit. Added 12 new documentation files (00-ERD through 10-troubleshooting + CHANGELOG). Deleted duplicate legacy docs (api-spec.md, architecture.md, etc). |
| 2025-06-18 | Dastrevas Agent | Initial Expo SDK 54 setup, WebView authentication, CORS configuration, API URL setup |

## Documentation Index

### Getting Started
- **[CHANGELOG](CHANGELOG.md)** - Version history and release notes

### Architecture & Design
- **[00-ERD](00-ERD.md)** - Entity Relationship Diagram and data models
- **[01-app-design](01-app-design.md)** - UI/UX design, color palette, typography, wireframes
- **[02-architecture](02-architecture.md)** - System architecture, folder structure, data flow

### Features & Implementation
- **[03-features](03-features.md)** - Feature specifications and user flows
- **[04-api](04-api.md)** - API documentation, endpoints, request/response schemas
- **[05-database](05-database.md)** - Database schema and relationships

### Development
- **[06-components](06-components.md)** - Reusable component library
- **[07-state](07-state.md)** - State management (Zustand + React Query)
- **[08-navigation](08-navigation.md)** - Routing structure and navigation

### Operations
- **[09-deployment](09-deployment.md)** - Build, testing, and deployment guide
- **[10-troubleshooting](10-troubleshooting.md)** - Common issues and solutions

---

## Quick Reference

### Tech Stack
| Component | Technology |
|-----------|------------|
| Framework | Expo SDK 54 |
| UI | React Native |
| Language | TypeScript 5.x |
| Routing | Expo Router 4.x |
| Global State | Zustand 5.x |
| Server State | React Query 5.x |
| Styling | NativeWind 4.x |
| HTTP | Axios 1.x |

### API Base URL
```
https://taskplanner.dastrevas.com/api
```

### Query Keys (React Query)
```typescript
['tasks']        // All tasks
['taskStats']    // Dashboard stats
['dailyStats']   // Daily chart data
['weeklyStats']  // Weekly chart data
```

### Navigation Routes
```
/                   → Dashboard
/overview          → Overview screen
/profile           → Profile screen
/new-task          → Create task
/new-task?taskId=x → Edit task
```

### Task Status Flow
```
PENDING → DONE (complete)
PENDING → SKIPPED (skip)
DONE → PENDING (undo)
SKIPPED → PENDING (reactivate)
```

---

## File Structure

```
pemrograman-mobile/
├── src/
│   ├── app/                    # Expo Router pages
│   ├── components/             # Reusable components
│   ├── services/               # API services
│   ├── store/                  # Zustand stores
│   ├── notifications/           # Push notifications
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utilities
├── docs/                       # This documentation
│   ├── APP-mobile.md           # (this file)
│   ├── 00-ERD.md              # Entity relationships
│   ├── 01-app-design.md        # UI/UX design
│   ├── 02-architecture.md      # System architecture
│   ├── 03-features.md          # Feature specs
│   ├── 04-api.md              # API documentation
│   ├── 05-database.md          # Database schema
│   ├── 06-components.md        # Component library
│   ├── 07-state.md            # State management
│   ├── 08-navigation.md        # Navigation setup
│   ├── 09-deployment.md        # Build & deploy
│   ├── 10-troubleshooting.md    # Common issues
│   └── CHANGELOG.md            # Version history
├── assets/                     # Images & icons
├── app.json                   # Expo configuration
└── package.json               # Dependencies
```

---

## Common Tasks

### Run Development Server
```bash
cd pemrograman-mobile
npx expo start --clear
```

### Build for Production
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### Build iOS dan Pasang ke HP via TestFlight

#### Prasyarat
1. MacBook/macOS untuk setup awal dan akses akun Apple
2. Akun Apple Developer aktif
3. Aplikasi sudah punya `bundleIdentifier` iOS: `com.dastrevas.smarttaskplanner`
4. Expo account aktif dan project sudah terhubung ke EAS
5. Tester memakai iPhone/iPad dan install aplikasi TestFlight dari App Store

#### 1. Cek konfigurasi project
Pastikan konfigurasi iOS sudah ada di `app.json`:

```json
{
  "expo": {
    "owner": "bayufrd",
    "slug": "smart-task-planner",
    "scheme": "smart-task-planner",
    "ios": {
      "bundleIdentifier": "com.dastrevas.smarttaskplanner",
      "supportsTablet": true
    }
  }
}
```

#### 2. Login dan siapkan EAS Build
Jalankan dari folder project mobile:

```bash
cd pemrograman-mobile
npm install -g eas-cli
eas login
eas build:configure
```

Jika belum ada `eas.json`, buat dulu. Contoh minimal:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {
      "ios": {}
    }
  }
}
```

#### 3. Build iOS untuk TestFlight
Untuk kirim ke TestFlight, pakai profile production:

```bash
eas build --platform ios --profile production
```

Saat pertama kali build, EAS biasanya akan:
1. Meminta login Apple Developer
2. Membuat atau memilih certificate
3. Membuat atau memilih provisioning profile
4. Menghubungkan app ke App Store Connect

Tunggu build selesai lalu buka link hasil build dari EAS dashboard.

#### 4. Upload build ke App Store Connect
Paling cepat pakai submit command:

```bash
eas submit --platform ios --profile production
```

Alternatif manual:
1. Download file `.ipa` dari hasil build EAS
2. Install aplikasi Transporter di macOS
3. Login ke App Store Connect di Transporter
4. Drag file `.ipa` ke Transporter
5. Klik Deliver

#### 5. Aktifkan build di TestFlight
Sesudah upload:
1. Buka App Store Connect
2. Pilih aplikasi Smart Task Planner
3. Buka menu TestFlight
4. Tunggu status processing selesai dari Apple
5. Isi informasi compliance bila diminta
6. Tambahkan tester internal atau external

Catatan:
- Internal tester biasanya lebih cepat aktif
- External tester biasanya perlu review beta app dari Apple

#### 6. Pasang di iPhone lewat TestFlight
Langkah tester:
1. Install TestFlight dari App Store
2. Buka undangan email tester atau public link TestFlight
3. Tap Accept / View in TestFlight
4. Pilih build tersedia
5. Tap Install
6. Setelah selesai, buka aplikasi di iPhone

#### 7. Update build berikutnya
Kalau ada perubahan kode:

```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

Naikkan `version` di `app.json` bila memang rilis versi baru. Jika butuh pembeda build number iOS, tambahkan field berikut:

```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

#### 8. Checklist sebelum kirim tester
- API production sudah benar di file environment
- Login berjalan normal di iPhone
- Navigasi utama aman
- Create, edit, delete task aman
- Tidak ada crash saat app dibuka pertama kali
- Icon dan nama app sudah benar

#### 9. Masalah umum
- Build gagal di signing: cek akses Apple Developer dan bundle identifier
- Build tidak muncul di TestFlight: tunggu processing App Store Connect selesai
- Tester tidak bisa install: pastikan tester sudah ditambahkan ke grup TestFlight
- Login Google iOS gagal: cek client ID iOS dan redirect scheme mobile

### Build Local iPhone via Xcode tanpa TestFlight

Cara ini cocok kalau:
1. Tidak punya Apple Developer Program berbayar
2. Ingin pasang app ke iPhone sendiri untuk testing
3. Tidak perlu distribusi ke user lain lewat TestFlight

Batasan penting:
- Tetap butuh Apple ID untuk login di Xcode
- App hanya bisa dipasang ke device milik sendiri/terdaftar pada sesi development
- Masa berlaku signing gratis biasanya terbatas, jadi kadang perlu install ulang
- Tidak bisa dipakai untuk distribusi public atau TestFlight

#### Prasyarat
1. Install full Xcode dari App Store, bukan hanya Command Line Tools
2. Jalankan Xcode sekali sampai setup awal selesai
3. Login Apple ID di Xcode: `Xcode > Settings > Accounts`
4. iPhone dihubungkan ke Mac via kabel atau trusted wireless debugging
5. Di iPhone aktifkan `Developer Mode` bila diminta

#### Status project saat ini
Project ini sudah punya folder native iOS:
- `pemrograman-mobile/ios/`
- `pemrograman-mobile/ios/SmartTaskPlanner.xcworkspace`

Tapi pada mesin ini, full Xcode belum aktif. Yang terdeteksi baru Command Line Tools, jadi build lokal ke iPhone belum bisa dijalankan sampai Xcode penuh terpasang dan aktif.

#### 1. Aktifkan Xcode penuh di macOS
Setelah install Xcode, jalankan command berikut:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

Verifikasi:

```bash
xcodebuild -version
```

#### 2. Install dependency project
Dari folder mobile:

```bash
cd pemrograman-mobile
npm install
```

Kalau folder `ios/` belum ada, generate dulu:

```bash
npx expo prebuild --platform ios
```

Kalau folder `ios/` sudah ada seperti project ini, tidak wajib prebuild ulang kecuali ada perubahan config native.

#### 3. Buka project iOS di Xcode
Buka workspace, bukan project biasa:

```bash
open ios/SmartTaskPlanner.xcworkspace
```

Di Xcode:
1. Pilih target `SmartTaskPlanner`
2. Buka tab `Signing & Capabilities`
3. Centang `Automatically manage signing`
4. Pilih `Team` sesuai Apple ID anda
5. Pastikan `Bundle Identifier` unik, misalnya `com.namaanda.smarttaskplanner`

Kalau `bundleIdentifier` bentrok, ubah juga di `app.json` lalu sync lagi bila perlu.

#### 4. Hubungkan iPhone
Langkah di device:
1. Sambungkan iPhone ke Mac
2. Tap `Trust This Computer`
3. Masukkan passcode iPhone
4. Jika iOS meminta `Developer Mode`, aktifkan lalu restart device

Di Xcode, pilih device iPhone anda di dropdown atas.

#### 5. Build dan pasang ke iPhone
Dari Xcode:
1. Pilih device iPhone target
2. Tekan tombol `Run` atau shortcut `Cmd+R`
3. Tunggu proses compile, signing, install
4. Jika pertama kali, buka iPhone lalu izinkan developer app bila diminta

Alternatif lewat Expo CLI setelah Xcode siap:

```bash
npx expo run:ios --device
```

Command ini akan memakai project native `ios/` dan minta pilih iPhone yang terhubung.

#### 6. Kalau app tidak bisa dibuka di iPhone
Buka di iPhone:
`Settings > General > VPN & Device Management`

Lalu:
1. pilih profil developer anda
2. tap `Trust`
3. buka ulang app

#### 7. Menjalankan Metro bundler
Untuk live reload JavaScript:

```bash
npx expo start --dev-client
```

Jika app hasil Xcode/dev build sudah terpasang di iPhone, buka app itu lalu sambungkan ke Metro bundler.

#### 8. Troubleshooting umum build lokal iPhone
- `xcodebuild requires Xcode` → full Xcode belum terinstall/aktif
- device tidak muncul di Xcode → cek kabel, trust dialog, dan Developer Mode
- signing error → cek Apple ID login di Xcode dan team terpilih
- bundle identifier conflict → ganti `ios.bundleIdentifier` di `app.json`
- pod error → jalankan `cd ios && pod install`

#### 9. Command ringkas yang nanti anda pakai
```bash
cd pemrograman-mobile
npx expo start --dev-client
open ios/SmartTaskPlanner.xcworkspace
```

Atau sesudah Xcode siap:

```bash
cd pemrograman-mobile
npx expo run:ios --device
```

### Add New Screen
1. Create file in `src/app/(main)/(tabs)/`
2. Add tab entry in `_layout.tsx`
3. Export default component

### Add New Component
1. Create file in `src/components/`
2. Define TypeScript props interface
3. Export default component
4. Import in parent screen

---

## Support

For issues or questions:
1. Check [troubleshooting guide](10-troubleshooting.md)
2. Review [API documentation](04-api.md)
3. Check Expo Router docs: https://docs.expo.dev/routing/introduction/
