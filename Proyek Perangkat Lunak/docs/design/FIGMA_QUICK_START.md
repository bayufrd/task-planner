# 🎨 QUICK START: Import ke Figma dalam 5 Menit

**Sudah bosan dengan file format? Langsung action saja!**

---

## 📝 Yang Anda Butuhkan:

1. **Akses Figma** (free or paid)
2. **File ini** dibuka di samping
3. **20 menit waktu**

---

## 🚀 STEP-BY-STEP TERCEPAT

### STEP 1: Setup Figma File (3 menit)

```
1. Buka figma.com
2. Click "New File" → beri nama "Task Planner - Design"
3. Panels yang akan digunakan:
   - Assets (kiri bawah) → untuk colors & text styles
   - Design (kanan) → untuk properties
   - Prototype (kanan) → untuk interactions
```

### STEP 2: Buat Color Styles (5 menit)

**Buka tab "Assets" → Colors**

```
Paste warna-warna ini satu-satu:

🔵 Primary
├─ Blue: #3B82F6
└─ Cyan: #06B6D4

✅ Success  
├─ Green: #10B981
└─ Emerald: #059669

⚠️ Warning
├─ Amber: #F59E0B
└─ Orange: #D97706

🔴 Danger
├─ Red: #DC2626
└─ Orange: #F97316

⚪ Neutral
├─ Gray-100: #F3F4F6
├─ Gray-500: #6B7280
└─ Gray-950: #111827
```

**Cara menambah color:**
1. Di canvas, buat rectangle
2. Select rectangle
3. Di "Design" panel (kanan), klik color fill
4. Klik "+" untuk save sebagai style
5. Rename: "Primary/Blue" dst
6. Delete rectangle
7. Repeat untuk semua warna

### STEP 3: Buat Typography Styles (5 menit)

**Buat text styles di Assets**

```
1. Di canvas: buat text "Heading"
2. Di Design panel (kanan) → Typography
3. Set:
   - Font: Inter (atau Roboto)
   - Size: 28
   - Weight: Bold (700)
   - Line height: 36
4. Di Design panel, cari "Text" section
5. Klik "+" untuk save sebagai style
6. Rename: "H1/28"
7. Delete text
8. Repeat untuk:
   - Display/32
   - H1/28
   - H2/24
   - H3/20
   - Body/16
   - Small/14
   - Tiny/12
```

### STEP 4: Buat Button Component (3 menit)

**Primary Button:**

1. **Buat Rectangle**: 
   - Width: 120
   - Height: 40
   - Corner radius: 12
   - Fill: Primary Gradient (buat gradient baru):
     - Start color: #3B82F6 (Primary Blue)
     - End color: #06B6D4 (Cyan)
     - Angle: 135°

2. **Tambah Text**:
   - Content: "Button"
   - Style: Body (apply text style yang sudah dibuat)
   - Color: White
   - Center align

3. **Buat Component**:
   - Select rectangle + text (group dulu: Ctrl+G)
   - Right-click → "Create component"
   - Rename: `Button/Primary`

4. **Buat Variants**:
   - Right-click component → "Create component set"
   - Add variant:
     - State: Hover (kasih shadow, scale sedikit)
     - State: Disabled (opacity 50%)
     - State: Active (scale 95%)

**Secondary Button:** (sama, tapi fill #F3F4F6, text gray-700)

### STEP 5: Buat Badge Component (3 menit)

1. **Buat Rectangle**:
   - Width: 80
   - Height: 28
   - Corner radius: 8

2. **Untuk Variants**:
   - HIGH: Fill red gradient (#DC2626 → #F97316), text white
   - MEDIUM: Fill yellow gradient (#EAB308 → #F97316), text white
   - LOW: Fill green gradient (#16A34A → #059669), text white

3. **Make as component**: `Badge/Priority`

### STEP 6: Buat Task Card Component (5 menit) - PENTING!

Ini component terpenting:

```
1. Frame 1408 × 90 (buat frame)
   - Fill: white
   - Border: left 4px, blue (#3B82F6)
   - Corner radius: 12
   - Padding: 16 all

2. Dalam frame, buat auto layout (Shift+A):
   - Horizontal
   - Gap: 16
   - Padding: 0 (sudah di frame)

3. Left section (flex):
   - Group: Status icon + Title + Meta
   - Content:
     ├─ Status icon (36×36): "✅" or "⏳" or "📝"
     ├─ Title: "Design new page"
     ├─ Description: "Create responsive..."
     └─ Meta badges:
         ├─ Priority (HIGH badge)
         ├─ Deadline: "Apr 10"
         ├─ Days: "2 days left"
         └─ Tags: "#design"

4. Right section (flex-col):
   - Score box:
     ├─ BG: Primary gradient
     ├─ Text: "92" (size 24, bold white)
     └─ Label: "Priority Score" (size 12, white)
   - Action buttons:
     ├─ Done (✓)
     ├─ Play/Pause (▶️)
     └─ Delete (🗑️)

5. Make as component: `TaskCard`

6. Create variants:
   - Status: TODO | IN_PROGRESS | DONE
   - Priority: HIGH | MEDIUM | LOW
```

### STEP 7: Buat Wireframe Screen (5 menit)

**Dashboard (1440 × 900):**

1. **Create new frame**: 1440 × 900
2. **Add components**:
   ```
   Header (0, 0):
   ├─ Logo "📅 Task Planner"
   ├─ Search button
   ├─ Language toggle (EN/ID)
   ├─ Theme toggle
   └─ Menu
   
   Calendar (0, 64):
   ├─ Today card (Primary gradient)
   ├─ Month nav (Apr 2026)
   └─ 7×6 calendar grid
   
   Tasks (0, 344):
   ├─ View selector (Today/Upcoming/All)
   └─ Task card instances (stack vertical)
   ```

3. **Drag components ke dalam frame**
4. **Set constraints** (right-click → Constraints):
   - Header: left, right, top
   - Calendar: left, right
   - Tasks: left, right, top, bottom

---

## 📱 COPY-PASTE READY: Color Hex Values

```
Primary Blue:      #3B82F6
Primary Cyan:      #06B6D4
Success Green:     #10B981
Success Emerald:   #059669
Warning Amber:     #F59E0B
Warning Orange:    #D97706
Danger Red:        #DC2626
Danger Orange:     #F97316
Gray 100:          #F3F4F6
Gray 500:          #6B7280
Gray 950:          #111827
White:             #FFFFFF
Black/80:          rgba(0,0,0,0.8)
```

---

## 📐 COPY-PASTE READY: Spacing Values

```
xs (4px)
sm (8px)
md (16px)
lg (24px)
xl (32px)
2xl (48px)
3xl (56px)
4xl (64px)
```

---

## 📏 COPY-PASTE READY: Border Radius

```
sm: 4px
md: 6px
lg: 8px
xl: 12px
2xl: 16px
3xl: 20px
```

---

## ✨ COPY-PASTE READY: Shadows

```
Shadow-sm:   0 1px 2px rgba(0,0,0,0.05)
Shadow-md:   0 4px 6px rgba(0,0,0,0.1)
Shadow-lg:   0 10px 15px rgba(0,0,0,0.1)
Shadow-xl:   0 20px 25px rgba(0,0,0,0.1)
Shadow-2xl:  0 25px 50px rgba(0,0,0,0.25)
```

---

## 🎯 Kalau Stuck, Ikuti Ini:

### ❌ "Saya tidak bisa buat gradient"
✅ Solusi:
1. Select rectangle
2. Klik color fill di Design panel
3. Klik gradient icon (tidak solid)
4. Ubah end color

### ❌ "Component tidak bisa di-edit"
✅ Solusi:
1. Double-click component
2. Di toolbar muncul "Edit main component"
3. Edit teks/warna
4. Instances otomatis update

### ❌ "Saya tidak bisa buat variants"
✅ Solusi:
1. Right-click component → "Create component set"
2. Akan ada "+" button di layers
3. Klik "+" → "Add variant"
4. Ubah property (buat yang berbeda)

### ❌ "File saya lag/slow"
✅ Solusi:
1. Hapus components yang duplikat
2. Consolidate variants ke satu component set
3. Delete unused pages
4. Restart Figma

---

## 🎉 Checklist Completion

- [ ] File dibuat: "Task Planner - Design"
- [ ] 11 colors ditambahkan
- [ ] 7 typography styles dibuat
- [ ] Button/Primary component dibuat
- [ ] Button/Secondary component dibuat  
- [ ] Badge/Priority component dibuat
- [ ] TaskCard component dibuat dengan variants
- [ ] Dashboard frame 1440×900 dibuat
- [ ] Semua components di-instance ke frame
- [ ] File disimpan & diberi nama yang jelas

---

## 🚀 Next Steps Setelah Selesai:

1. **Publish Library** (jika team):
   - Right-click file → "Publish library"
   - Share link dengan team
   - Team bisa use components dengan subscribe

2. **Create Prototype**:
   - Select frame
   - Tab "Prototype"
   - Click button → set destination frame
   - Share prototype link untuk testing

3. **Export Assets**:
   - Select component
   - Right-click → "Export"
   - Pilih SVG untuk icons
   - Pilih PNG untuk images

4. **Handoff to Developers**:
   - Klik "Share" → "View only" link
   - Developers bisa inspect code via plugin
   - Atau share specific frames

---

## 💾 QUICK SAVE UNTUK OFFLINE

Jika internet putus:

1. Klik menu (3 dots)
2. "Save local file"
3. File tersimpan di computer
4. Nanti bisa re-upload ke Figma

---

## 📞 Figma Tips Menghemat Waktu

- **Ctrl+Duplicate**: Copy & paste cepat
- **Shift+R**: Rotate
- **Shift+Ctrl+G**: Ungroup
- **Shift+A**: Auto layout
- **D**: Select color
- **T**: Select text
- **E**: Select hand/zoom

---

## ✅ Status

- ✅ Ready to use
- ✅ Semua color values tersedia
- ✅ Semua spacing values tersedia
- ✅ Step-by-step clear & simple
- ✅ Cocok untuk pemula

---

**Selesai! Semua yang Anda butuhkan ada di sini.**

Mulai dari STEP 1 dan ikuti urutan. Tidak perlu import JSON atau setup ribet.

**Berapa lama?** 20-30 menit saja untuk complete design system!

🎉 **Happy Designing!**
