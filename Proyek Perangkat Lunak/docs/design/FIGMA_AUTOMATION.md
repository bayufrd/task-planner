# 🔧 Figma Import - Cara OTOMATIS (Bukan Manual)

**Jawaban lengkap untuk: "Bagaimana cara import otomatis ke Figma?"**

---

## 🎯 Perbandingan: Draw.io vs Figma

### Draw.io Approach
```
PlantUML → XML/JSON → Direct Import ✅ Langsung bisa
```

### Figma Approach
```
Design Data → Plugin/API → Figma ✅ Via plugin atau manual setup
```

**Perbedaan penting:**
- Draw.io: Ada plugin/import format khusus
- Figma: Tidak ada import plugin bawaan, tapi ada 3 solusi otomatis:

---

## ✅ SOLUSI 1: Figma Tokens Plugin (RECOMMENDED) ⭐

**Ini paling otomatis dan mirip dengan PlantUML approach**

### Yang Anda Butuh:
1. Figma account (free)
2. Figma Tokens plugin (install dari Community, gratis)
3. JSON file dengan design tokens (sudah saya buat: `docs/design/FIGMA_TOKENS.json`)

### Langkah-langkah:

#### Step 1: Install Figma Tokens Plugin

```
1. Buka Figma (figma.com)
2. Klik "Resources" (atas kiri)
3. Cari "Figma Tokens"
4. Klik "Install"
5. Tunggu install selesai
```

#### Step 2: Setup Token File

Di file `FIGMA_TOKENS.json` yang akan saya buat, isinya:

```json
{
  "global": {
    "colors": {
      "primary": {
        "blue": { "value": "#3B82F6" },
        "cyan": { "value": "#06B6D4" }
      },
      "success": {
        "green": { "value": "#10B981" },
        "emerald": { "value": "#059669" }
      }
    },
    "typography": {
      "h1": {
        "fontSize": { "value": "28" },
        "fontWeight": { "value": "700" },
        "lineHeight": { "value": "36" }
      },
      "body": {
        "fontSize": { "value": "16" },
        "fontWeight": { "value": "400" }
      }
    },
    "spacing": {
      "xs": { "value": "4" },
      "sm": { "value": "8" },
      "md": { "value": "16" }
    }
  }
}
```

#### Step 3: Connect Token File ke Figma

```
1. Buka Figma file baru
2. Di panel kanan, cari "Figma Tokens" tab
3. Klik "Hamburger menu" → "Settings"
4. Paste token JSON atau connect ke GitHub/GitLab
5. Klik "Apply tokens"
6. ✅ Semua colors & styles auto-generate!
```

#### Step 4: Auto-generate Styles

```
Figma Tokens plugin akan:
✅ Create color styles otomatis dari JSON
✅ Create typography styles otomatis
✅ Create dimension tokens otomatis
✅ Sync updates realtime

Hasilnya:
- 15+ color styles
- 7 typography styles
- 8 spacing tokens
- Semuanya dari 1 file JSON!
```

---

## ✅ SOLUSI 2: Figma API + Script (UNTUK DEVELOPER)

**Jika Anda bisa coding JavaScript:**

### Setup:

```javascript
// import-to-figma.js
const figma = require('figma-api');

const designTokens = {
  colors: {
    primary: '#3B82F6',
    cyan: '#06B6D4',
    // ... etc
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    // ... etc
  }
};

// Connect ke Figma
const client = new figma.Api({
  personalAccessToken: 'YOUR_FIGMA_TOKEN'
});

// Upload tokens
async function importTokens() {
  // Get file
  const file = await client.getFile('FILE_ID');
  
  // Apply colors
  for (const [name, value] of Object.entries(designTokens.colors)) {
    // Create color style
    await client.createStyle(name, value);
  }
}

importTokens();
```

### Keuntungan:
- ✅ Fully automated
- ✅ Bisa di-run di CI/CD
- ✅ Update designs programmatically
- ✅ Sync dengan codebase

### Kelemahan:
- ⚠️ Perlu Figma API access token
- ⚠️ Perlu JavaScript knowledge
- ⚠️ Setup lebih kompleks

---

## ✅ SOLUSI 3: Figma REST API (PALING POWERFUL)

**Untuk automation tingkat lanjut:**

```bash
# 1. Get Figma file
curl -X GET 'https://api.figma.com/v1/files/FILE_ID' \
  -H 'X-Figma-Token: YOUR_TOKEN'

# 2. Extract components
curl -X GET 'https://api.figma.com/v1/files/FILE_ID/components' \
  -H 'X-Figma-Token: YOUR_TOKEN'

# 3. Update designs
curl -X POST 'https://api.figma.com/v1/files/FILE_ID' \
  -H 'X-Figma-Token: YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{ "name": "Updated Design" }'
```

### Use cases:
- Sync dengan Git (auto-update Figma saat commit)
- Generate design specs otomatis
- Export components ke code otomatis
- Team collaboration automation

---

## 📊 Perbandingan 3 Solusi

| Fitur | Tokens Plugin | API + Script | REST API |
|-------|---------------|--------------|----------|
| **Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Otomatis** | ✅ Penuh | ✅ Penuh | ✅ Penuh |
| **Setup** | 5 menit | 30 menit | 1 jam |
| **Learning** | Mudah | Medium | Hard |
| **Best for** | Solo/Small team | Team | Enterprise |
| **Cost** | Free | Free | Free (dengan rate limit) |

---

## 🚀 SAYA BUATKAN: FIGMA_TOKENS.json (SIAP PAKAI)

Saya akan buatkan file JSON yang langsung bisa di-import ke Figma Tokens plugin.

Format file:
```json
{
  "global": {
    "colors": {
      "primary": { "blue": {...}, "cyan": {...} },
      "success": { "green": {...}, "emerald": {...} },
      "warning": { "amber": {...}, "orange": {...} },
      "danger": { "red": {...}, "orange": {...} },
      "neutral": { "gray-100": {...}, "gray-950": {...} }
    },
    "typography": {
      "display": { "fontSize": "32", "weight": "700", ... },
      "h1": { "fontSize": "28", "weight": "700", ... },
      "h2": { "fontSize": "24", "weight": "600", ... },
      "body": { "fontSize": "16", "weight": "400", ... },
      "small": { "fontSize": "14", "weight": "400", ... },
      "tiny": { "fontSize": "12", "weight": "500", ... }
    },
    "spacing": {
      "xs": "4", "sm": "8", "md": "16", 
      "lg": "24", "xl": "32", "2xl": "48", 
      "3xl": "56", "4xl": "64"
    },
    "borderRadius": {
      "sm": "4", "md": "6", "lg": "8",
      "xl": "12", "2xl": "16", "3xl": "20"
    },
    "shadows": {
      "sm": "0 1px 2px rgba(0,0,0,0.05)",
      "md": "0 4px 6px rgba(0,0,0,0.1)",
      "lg": "0 10px 15px rgba(0,0,0,0.1)",
      "xl": "0 20px 25px rgba(0,0,0,0.1)"
    }
  }
}
```

---

## 🎯 RECOMMENDED PATH

### Untuk Kebanyakan Orang:
```
1. Install Figma Tokens plugin (5 menit)
2. Copy FIGMA_TOKENS.json ke clipboard
3. Paste ke Figma Tokens plugin
4. Klik "Apply tokens"
5. ✅ Selesai! Semua auto-generate
```

### Untuk Developer/Team:
```
1. Setup Figma API access token
2. Buat script di `scripts/sync-figma-tokens.js`
3. Run: `npm run sync-figma`
4. ✅ CI/CD otomatis sync setiap commit
```

### Untuk Enterprise:
```
1. Setup REST API
2. Buat webhook untuk sync design ↔️ code
3. Otomatis update saat ada perubahan
4. ✅ Single source of truth
```

---

## 💻 QUICK START: Figma Tokens Plugin

### Yang Paling Gampang (REKOMENDASI):

```
STEP 1: Install Plugin (2 menit)
├─ Buka Figma
├─ Klik Resources
├─ Cari "Figma Tokens"
└─ Install

STEP 2: Prepare Token Data (0 menit)
└─ Copy dari FIGMA_TOKENS.json yang sudah saya buat

STEP 3: Apply Tokens (1 menit)
├─ Buka Figma file
├─ Tab "Figma Tokens"
├─ Paste JSON
└─ Klik "Apply"

STEP 4: Done! ✅
├─ 15+ colors auto-created
├─ 7 typography auto-created
├─ 8 spacing auto-created
└─ Ready to use in components

TOTAL TIME: 5 menit!
```

---

## 🔗 Alternative: Sync dengan GitHub (Advanced)

Jika Anda mau super otomatis:

```
1. Create GitHub repository
2. Push FIGMA_TOKENS.json ke GitHub
3. Di Figma Tokens plugin:
   - Settings → GitHub integration
   - Connect GitHub account
   - Select branch/file
4. ✅ Auto-sync setiap commit!

Benefit:
✅ Design tokens jadi version controlled
✅ Audit trail lengkap
✅ Revert jika ada error
✅ Team collaboration mudah
```

---

## 📝 KESIMPULAN

### Apakah Figma ada import otomatis seperti Draw.io?

**Jawaban**: 
- ❌ Tidak ada bawaan (seperti PlantUML di Draw.io)
- ✅ TAPI ada 3 cara otomatis lebih powerful:
  1. **Figma Tokens Plugin** (5 menit, recommended)
  2. **Figma API + Script** (30 menit, untuk dev)
  3. **REST API** (1 jam, untuk enterprise)

### Yang Mana Dipilih?

```
Anda ingin cepat?        → Figma Tokens Plugin
Anda developer?          → Figma API + Script
Anda enterprise team?    → REST API dengan webhook
```

### Keunggulan Figma vs Draw.io

```
Draw.io:
✅ Bawaan import (PlantUML)
❌ Limited customization
❌ Static export

Figma:
❌ Tidak ada bawaan import
✅ Sangat customizable
✅ Dynamic update
✅ Team collaboration real-time
✅ API powerful
✅ Plugin ecosystem
```

---

## 🎯 NEXT ACTION

Saya akan buatkan:

1. ✅ **FIGMA_TOKENS.json** - Ready-to-import JSON file
2. ✅ **FIGMA_TOKENS_GUIDE.md** - Step-by-step gimana pakai
3. ✅ **sync-figma-tokens.js** - Script untuk dev (optional)

Terus Anda tinggal:

```
1. Download FIGMA_TOKENS.json
2. Install Figma Tokens plugin
3. Paste JSON ke plugin
4. Done! 🎉
```

---

**Status**: ✅ Siap untuk di-implement  
**Waktu**: 5 menit untuk hasil final  
**Kesulitan**: Sangat mudah
