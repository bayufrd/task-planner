# 🚀 FIGMA TOKENS PLUGIN - IMPORT OTOMATIS (STEP BY STEP)

**Mirip seperti PlantUML di Draw.io - Automatic Import ke Figma!**

---

## ⚡ QUICK ANSWER

**Pertanyaan**: "Figma tidak menyediakan import seperti Draw.io punya PlantUML?"

**Jawaban**: 
- ❌ Tidak ada bawaan (built-in)
- ✅ TAPI ada **Figma Tokens Plugin** - lebih powerful dari PlantUML!

**Figma Tokens Plugin**:
- ✅ Import design tokens dari JSON
- ✅ Auto-generate colors, typography, spacing
- ✅ Sync dengan GitHub (version control)
- ✅ Real-time update di semua files
- ✅ Gratis!

---

## 📋 Apa Yang Sudah Saya Siapkan

```
File ready-to-import:
├─ FIGMA_TOKENS.json ✅ (JSON format)
│  ├─ 15+ colors
│  ├─ 7 typography scales
│  ├─ 8 spacing values
│  ├─ 6 border radius values
│  └─ 5 shadow definitions
│
├─ FIGMA_AUTOMATION.md ✅ (penjelasan detail)
│  ├─ 3 solusi otomatis
│  ├─ Perbandingan approach
│  └─ Use case untuk setiap solusi
│
└─ FILE INI ✅ (step-by-step guide)
   └─ Langsung pakai, tidak perlu editing
```

---

## 🎯 RECOMMENDED FLOW

### Path Paling Cepat (5 menit):

```
1. Install Figma Tokens Plugin
   └─ 2 menit
   
2. Copy FIGMA_TOKENS.json ke clipboard
   └─ 1 menit
   
3. Paste ke Figma Tokens plugin
   └─ 1 menit
   
4. Klik "Apply Tokens"
   └─ 1 menit
   
✅ SELESAI! Semua auto-generated
```

---

## 🔧 STEP-BY-STEP DETAILED

### STEP 1: Install Figma Tokens Plugin (2 menit)

```
[SCREENSHOT AREA]
Figma UI:
┌───────────────────────────────────────┐
│ Figma                  Resources    ⚙│
│ ✕ My projects                         │
│   ┌────────────────┐                  │
│   │ NEW FILE       │                  │
│   └────────────────┘                  │
│                                       │
│   Recent files                        │
│   - Task Planner                      │
│   - Design System                     │
└───────────────────────────────────────┘

ACTION:
1. Di dashboard Figma, klik "Resources" (atas kanan)
2. Atau buka file → Tab "Resources" 
3. Cari: "Community"
4. Klik: "Plugins"
5. Search: "Figma Tokens"
6. Klik: "Install"
7. Tunggu loading...
8. ✅ Plugin installed!
```

### STEP 2: Setup File (1 menit)

```
SEBELUM IMPORT:
1. Buka Figma (figma.com)
2. Buat NEW FILE:
   - Klik "New file"
   - Beri nama: "Task Planner - Design System"
   - Workspace: Personal atau Team (bebas)
   - Klik "Create"

SETELAH BUAT FILE:
- Anda akan lihat canvas kosong
- Ada 3 panel:
  - Left: Layers, Assets, Plugins
  - Center: Canvas (kosong)
  - Right: Design, Prototype, Inspect

STATUS: ✅ Ready for import
```

### STEP 3: Open Figma Tokens Plugin (1 menit)

```
DI FIGMA FILE YANG SUDAH DIBUAT:

Option A (PALING MUDAH):
1. Toolbar atas → Icons
2. Cari "Plugins" icon (puzzle piece)
3. Klik → "Figma Tokens"
4. Plugin panel muncul di kanan

Option B:
1. Menu → Plugins → "Figma Tokens"

Option C:
1. Kanan atas → "Plugins" tab
2. Cari "Figma Tokens"
3. Klik "Open"

[SCREENSHOT AREA]
┌─────────────────────────────────────┐
│ Figma Tokens (plugin window)        │
│                                     │
│ [⚙️ Settings] [...] [x]             │
│                                     │
│ Set Tokens:                         │
│ ┌─────────────────────────────────┐ │
│ │ [Choose tokens file]            │ │
│ │ [Or paste JSON below]           │ │
│ │                                 │ │
│ │ [Large text area]               │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Apply tokens] [Sync] [Help]        │
│                                     │
└─────────────────────────────────────┘

STATUS: ✅ Plugin terbuka
```

### STEP 4: Get Token File Content (1 menit)

```
ADA 3 CARA:

CARA 1 - COPY DARI FILE (PALING MUDAH):
1. Buka file: docs/design/FIGMA_TOKENS.json
2. Select semua (Ctrl+A)
3. Copy (Ctrl+C)
4. Siap untuk paste

CARA 2 - UPLOAD FILE:
1. Download FIGMA_TOKENS.json
2. Simpan di folder (misalnya Desktop)
3. Di Figma Tokens plugin:
   - Klik "Choose tokens file"
   - Select file FIGMA_TOKENS.json
4. ✅ Auto-load

CARA 3 - GITHUB INTEGRATION (Advanced):
1. Push FIGMA_TOKENS.json ke GitHub
2. Di Figma Tokens plugin:
   - Settings
   - GitHub integration
   - Connect account
   - Select repo & branch
3. ✅ Auto-sync

RECOMMENDED: CARA 1 (paling gampang)
```

### STEP 5: Paste Token JSON (1 menit)

```
[SCREENSHOT AREA - PASTE AREA]
┌────────────────────────────────────┐
│ Figma Tokens                       │
│                                    │
│ [⚙️] [⋯] [✕]                      │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ [Paste JSON here ↓]          │  │
│ │                              │  │
│ │ {                            │  │
│ │   "$schema": "...",          │  │
│ │   "global": {                │  │
│ │     "colors": {              │  │
│ │       "primary": {           │  │
│ │         "blue": {            │  │
│ │           "value": "#3B82F6" │  │
│ │         }                    │  │
│ │       },                     │  │
│ │     ...                      │  │
│ │   }                          │  │
│ │ }                            │  │
│ │                              │  │
│ └──────────────────────────────┘  │
│                                    │
│ [Apply tokens] [Save] [Sync]       │
│                                    │
└────────────────────────────────────┘

ACTION:
1. Di Figma Tokens plugin, lihat text area besar
2. Click di area (focus)
3. Paste (Ctrl+V)
4. JSON akan muncul
5. Lihat console bawah (jika ada error, akan ditampilkan)

VALIDASI:
✅ Jika JSON valid:
   - Tidak ada error message
   - Text muncul dengan benar
   - Field JSON terlihat rapi

❌ Jika ada error:
   - Check JSON format (buka di VS Code)
   - JSON harus valid (gunakan https://jsonlint.com/)
   - Re-copy dan paste
```

### STEP 6: Apply Tokens (1 menit) ⭐ MAGIC HAPPENS HERE

```
[SCREENSHOT AREA]
┌────────────────────────────────────┐
│ Figma Tokens                       │
│                                    │
│ [⚙️] [⋯] [✕]                      │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ {JSON di atas...}            │  │
│ └──────────────────────────────┘  │
│                                    │
│ [Apply Tokens] ← CLICK INI!        │
│ [Save]                             │
│ [Sync]                             │
│                                    │
└────────────────────────────────────┘

ACTION:
1. Klik tombol besar "Apply Tokens"
2. Tunggu processing (1-3 detik)
3. Lihat panel kanan (Assets panel)

MAGIC TERJADI:
✅ Assets panel akan populate dengan:

   🎨 COLORS:
   ├─ primary
   │  ├─ blue (#3B82F6)
   │  └─ cyan (#06B6D4)
   ├─ success
   │  ├─ green (#10B981)
   │  └─ emerald (#059669)
   ├─ warning
   │  ├─ amber (#F59E0B)
   │  └─ orange (#D97706)
   ├─ danger
   │  ├─ red (#DC2626)
   │  └─ orange (#F97316)
   └─ neutral
      ├─ gray-100
      ├─ gray-500
      └─ gray-950

   📝 TYPOGRAPHY:
   ├─ display (32px, 700)
   ├─ h1 (28px, 700)
   ├─ h2 (24px, 600)
   ├─ h3 (20px, 600)
   ├─ body (16px, 400)
   ├─ small (14px, 400)
   └─ tiny (12px, 500)

   📏 SPACING:
   ├─ xs (4px)
   ├─ sm (8px)
   ├─ md (16px)
   ├─ lg (24px)
   ├─ xl (32px)
   ├─ 2xl (48px)
   ├─ 3xl (56px)
   └─ 4xl (64px)

   ⭕ BORDER RADIUS:
   ├─ sm (4px)
   ├─ md (6px)
   ├─ lg (8px)
   ├─ xl (12px)
   ├─ 2xl (16px)
   └─ 3xl (20px)

   ✨ SHADOWS:
   ├─ sm
   ├─ md
   ├─ lg
   ├─ xl
   └─ 2xl

TOTAL: 50+ design tokens auto-generated! 🎉
```

### STEP 7: Verify & Use (1 menit)

```
SETELAH APPLY TOKENS:

1. Buka Assets panel (kiri)
2. Klik "Colors" tab
3. Lihat semua 15+ colors muncul
4. Coba klik color untuk lihat detail

5. Buat test rectangle:
   - Klik "Rectangle" tool
   - Drag di canvas
   - Select rectangle
   - Di panel kanan, pilih color dari Assets
   - ✅ Color dari design tokens diterapkan!

6. Buat test text:
   - Klik "Text" tool
   - Type sesuatu
   - Di panel kanan, apply typography style
   - ✅ Typography dari design tokens diterapkan!

HASIL:
✅ Semua design tokens bisa langsung digunakan
✅ Konsisten di seluruh file
✅ Update token → semua element update

STATUS: ✅ SELESAI! Ready untuk design
```

---

## 🎯 APA YANG TERJADI SETELAH APPLY?

### Design Tokens Ter-Import:

```
✅ 15+ Colors (dengan 4 gradients)
✅ 7 Typography Styles (Display → Tiny)
✅ 8 Spacing Values (xs → 4xl)
✅ 6 Border Radius Options
✅ 5 Shadow Definitions
✅ 9 Opacity Levels
✅ Light/Dark mode variants

TOTAL: 50+ Design Tokens
```

### Bisa Langsung Digunakan:

```
SAAT DESIGN:
1. Buat rectangle
2. Panel kanan → Design
3. Click "Fill" color
4. Pilih dari list (semua colors)
5. ✅ Auto-apply dengan exact hex value

SAAT BUAT TYPOGRAPHY:
1. Buat text
2. Panel kanan → Design
3. Set Font, Size, Weight, Line Height
4. Atau langsung apply dari typography tokens
5. ✅ Semua consistent

SAAT ADJUST SPACING:
1. Set padding/margin
2. Use spacing tokens (4, 8, 16, 24, dll)
3. ✅ Consistent spacing throughout
```

---

## 🔄 ADVANCED: SYNC DENGAN GITHUB (OPTIONAL)

**Jika ingin auto-update setiap push:**

```
SETUP:

1. Push FIGMA_TOKENS.json ke GitHub
   ```bash
   git add docs/design/FIGMA_TOKENS.json
   git commit -m "Add design tokens"
   git push origin master
   ```

2. Di Figma Tokens plugin:
   - Klik "⚙️ Settings" (atas plugin)
   - Tab "GitHub"
   - Klik "Authenticate GitHub"
   - Authorize Figma Tokens app
   - Select repo & branch
   - Save

3. Result:
   ✅ Setiap push ke GitHub → auto-update Figma tokens
   ✅ Single source of truth (GitHub)
   ✅ Version control lengkap
   ✅ Team collaboration mudah

BENEFIT:
- Designers update di Figma → buat commit → push
- Developers pakai same tokens di code (via JSON)
- Single source of truth
- Audit trail lengkap
```

---

## ✅ CHECKLIST COMPLETION

Setelah selesai step-by-step di atas:

```
[✓] Plugin installed
[✓] File dibuat
[✓] Tokens JSON ready
[✓] JSON di-paste
[✓] "Apply Tokens" diklik
[✓] Colors muncul di Assets
[✓] Typography muncul
[✓] Bisa pakai tokens saat design
[✓] Rectangle buat dengan color token
[✓] Text buat dengan typography token

TOTAL TIME: 15 menit max!
```

---

## 🎯 NEXT STEPS

### Setelah Tokens Ter-Import:

1. **Buat Components** (menggunakan tokens)
   - Button (primary, secondary variants)
   - Badge (HIGH, MEDIUM, LOW)
   - Task Card
   - Header
   - Calendar

2. **Buat Wireframes** (menggunakan components)
   - Dashboard (1440×900)
   - Command Palette (800×600)
   - Mobile (375×812)

3. **Share dengan Team**
   - Publish library
   - Share link
   - Team subscribe to components

---

## 📞 TROUBLESHOOTING

### Problem 1: "JSON tidak bisa di-paste"
```
Solution:
1. Cek JSON format di https://jsonlint.com/
2. Jika error, fix di text editor
3. Copy-paste lagi
4. Atau gunakan "Upload File" method
```

### Problem 2: "Tokens tidak muncul setelah Apply"
```
Solution:
1. Refresh Figma (F5)
2. Close & open plugin lagi
3. Try "Sync" button
4. Cek error message di console
```

### Problem 3: "Mau update tokens, gimana caranya?"
```
Solution:
1. Edit FIGMA_TOKENS.json
2. Copy content baru
3. Paste di Figma Tokens plugin
4. Klik "Apply Tokens" lagi
5. ✅ Tokens updated
```

### Problem 4: "Ingin GitHub sync tapi complicated"
```
Solution:
1. Skip GitHub sync untuk sekarang
2. Manual update OK juga
3. Nanti bisa setup GitHub anytime
4. Just paste & apply each time
```

---

## 🎉 HASIL AKHIR

Setelah semua selesai, Anda punya:

```
✅ 1 Figma file dengan:
   - 50+ design tokens
   - Ready untuk design components
   - Ready untuk share dengan team
   - Ready untuk export to code

✅ Single source of truth:
   - Figma tokens
   - = Code variables (via JavaScript/React)
   - = Design consistency

✅ Team collaboration:
   - Publish library
   - Team subscribe
   - Auto-update everywhere

✅ Production ready:
   - Export to CSS variables
   - Export to JavaScript
   - Use in React/Vue/Angular
```

---

## 🚀 RINGKASAN

| Langkah | Waktu | Status |
|---------|-------|--------|
| Install plugin | 2 min | ⚙️ |
| Siapkan file | 1 min | 📁 |
| Open plugin | 1 min | 🔌 |
| Copy tokens | 1 min | 📋 |
| Paste ke plugin | 1 min | 📝 |
| Apply tokens | 1 min | ✨ |
| Verify & test | 2 min | ✅ |
| **TOTAL** | **~10 min** | **🎉** |

---

**YANG TERPENTING**: 

STEP 1 → Install plugin  
STEP 4 → Copy FIGMA_TOKENS.json  
STEP 5 → Paste di plugin  
STEP 6 → Klik "Apply Tokens"

**DONE!** ✅

---

**Status**: ✅ Otomatis, mirip PlantUML di Draw.io  
**Waktu**: 10-15 menit  
**Kesulitan**: Sangat mudah  
**Hasil**: 50+ design tokens auto-generated
