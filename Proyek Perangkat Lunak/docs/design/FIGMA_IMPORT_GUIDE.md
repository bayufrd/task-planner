# 📱 Panduan Import ke Figma - Smart Task Planner

## ⚠️ Masalah: File Format Tidak Didukung

Figma tidak mendukung import langsung dari JSON custom. Berikut adalah 3 cara yang bisa Anda gunakan:

---

## 🎯 CARA 1: Manual Import (Paling Mudah) ⭐ REKOMENDASI

Ini cara paling cepat dan yang paling sering digunakan. Ikuti step-by-step ini:

### Step 1: Buka Figma & Siapkan File
1. Buka Figma (figma.com)
2. Buat **New File** atau buka existing project
3. Rename file ke "Smart Task Planner - Design System"
4. Buat 3 pages:
   - "Design System"
   - "Components"
   - "Wireframes"

### Step 2: Setup Color Library (5 menit)
**Di page "Design System":**

1. **Buat Color Styles**
   - Klik `Assets` (panel kiri)
   - Klik `Colors` icon
   - Klik `+` untuk tambah color

   Tambahkan warna-warna ini:
   ```
   Primary Blue:      #3B82F6
   Primary Cyan:      #06B6D4
   Success Green:     #10B981
   Success Emerald:   #059669
   Warning Amber:     #F59E0B
   Warning Orange:    #D97706
   Danger Red:        #DC2626
   Danger Orange:     #F97316
   Neutral Gray 100:  #F3F4F6
   Neutral Gray 950:  #111827
   Dark Gray:         #1F2937
   Text Light:        #F9FAFB
   ```

2. **Buat Gradient Styles**
   - Primary Gradient: #3B82F6 → #06B6D4 (135°)
   - Success Gradient: #10B981 → #059669 (135°)
   - Warning Gradient: #F59E0B → #D97706 (135°)
   - Danger Gradient: #DC2626 → #F97316 (135°)

### Step 3: Setup Typography (5 menit)

1. **Buat Text Styles**
   - Klik `Assets` → `Text` icon
   - Klik `+` untuk tambah style

   Tambahkan typography ini:
   ```
   Display / 32px
   - Font: Inter Bold
   - Size: 32px
   - Weight: 700
   - Line Height: 40px
   
   H1 / 28px
   - Font: Inter Bold
   - Size: 28px
   - Weight: 700
   - Line Height: 36px
   
   H2 / 24px
   - Font: Inter Semibold
   - Size: 24px
   - Weight: 600
   - Line Height: 32px
   
   H3 / 20px
   - Font: Inter Semibold
   - Size: 20px
   - Weight: 600
   - Line Height: 28px
   
   Body / 16px
   - Font: Inter Regular
   - Size: 16px
   - Weight: 400
   - Line Height: 24px
   
   Small / 14px
   - Font: Inter Regular
   - Size: 14px
   - Weight: 400
   - Line Height: 20px
   
   Tiny / 12px
   - Font: Inter Medium
   - Size: 12px
   - Weight: 500
   - Line Height: 16px
   ```

### Step 4: Buat Components di Page "Components"

#### Component 1: Button - Primary (25 menit)
1. **Buat Rectangle** (120 × 40px)
   - Fill: Primary Gradient
   - Corners: 12px
   - Shadow: Shadow-lg (0, 10, 15, rgba(59, 130, 246, 0.3))

2. **Tambah Text** di dalam button
   - Content: "Button"
   - Style: Body (white color)
   - Center aligned

3. **Buat Variants**:
   - Normal state (di atas)
   - Hover state: Gradient lebih terang, scale 105%
   - Disabled state: Opacity 50%

4. **Naming Convention**: `Button/Primary`

#### Component 2: Button - Secondary
1. **Buat Rectangle** (120 × 40px)
   - Fill: #F3F4F6 (Neutral Gray 100)
   - Border: 1px, #E5E7EB
   - Corners: 8px
   - Text: Gray-700

2. **Variants**: Normal, Hover, Disabled
3. **Naming**: `Button/Secondary`

#### Component 3: Badge - Priority
1. **Buat Rectangle** (80 × 28px)
   - Corners: 8px
   - Text: white, semibold

2. **Variants**:
   - `Badge/Priority/High`: Danger Gradient
   - `Badge/Priority/Medium`: Warning Gradient
   - `Badge/Priority/Low`: Success Gradient

3. **Naming**: `Badge/Priority`

#### Component 4: Task Card (Penting!)
1. **Container**: 1408 × 90px, rounded-xl, border-l 4px (blue)
2. **Left Section**:
   - Icon area: 48px (status icon)
   - Title: H3 style, 24px
   - Meta info: Small style
   - Tags: Tag badge components

3. **Right Section**:
   - Score box: Gradient primary, 80×60px
   - Score text: Display style, white
   - Actions: 3 icon buttons

4. **Make as Component**: `TaskCard`
5. **Create Variants** for:
   - Status: TODO, IN_PROGRESS, DONE
   - Priority: HIGH, MEDIUM, LOW

#### Component 5: Calendar Today Card
1. **Buat Rectangle**: 320 × 80px
   - Fill: Primary Gradient
   - Corners: 16px
   - Padding: 16px

2. **Content**:
   - Icon + "Today" label
   - Date: "April 7"
   - Task count: "3 tasks planned"
   - All text white

3. **Make as Component**: `CalendarToday`

#### Component 6: Calendar Day Cell
1. **Buat Rectangle**: 40 × 40px
   - Fill: white
   - Border: 1px, gray-200
   - Corners: 8px

2. **Content**:
   - Date number
   - Optional task count badge

3. **Variants**:
   - Default
   - Selected (blue gradient bg)
   - Today (blue border)
   - Other month (gray, disabled)

4. **Make as Component**: `CalendarDay`

### Step 5: Buat Wireframe Screens di Page "Wireframes"

#### Screen 1: Dashboard (1440 × 900)

1. **Place Header (1440 × 64)**
   - Use Header component (buat dulu atau manual layout)
   - Position: 0, 0
   - Color: white/80
   - Border bottom: 1px, gray-200

2. **Place Calendar (1440 × 280)**
   - Position: 0, 64
   - Today card: left side, 320px width
   - Month nav: right side
   - Day grid: 7 columns

3. **Place Task List (1440 × 556)**
   - Position: 0, 344
   - View mode selector top (Today/Upcoming/All)
   - Task cards stacked vertically
   - Use TaskCard component instances

#### Screen 2: Command Palette Modal (800 × 600)

1. **Background Overlay**: full screen, black/40 opacity
2. **Modal Box**: 800 × 600, white, border radius 16px, shadow 2xl
3. **Input Section**:
   - Search icon + input field + close (X)
   - Background: gradient blue→cyan
   - Height: 60px
4. **Suggestions List**:
   - Item height: 50px
   - Icon + text + description
   - Hover: light blue bg
5. **Help Section**:
   - Two columns
   - Gray background boxes

#### Screen 3: Mobile View (375 × 812)

1. **Header**: 375 × 64 (adapted for mobile)
2. **Calendar**: 375 × 280 (responsive)
3. **Tasks**: 375 × 468 (responsive)
4. **All components scaled for 375px width**

### Step 6: Setup Design Tokens (Optional)

1. Buat frame khusus "Design Tokens"
2. Dokumentasikan:
   - Spacing scale (xs, sm, md, lg, xl, 2xl, 3xl, 4xl)
   - Border radius values
   - Shadow definitions
   - Icon sizes (w-4, w-5, w-6)

### Step 7: Share Library (Jika Untuk Tim)

1. Right-click file → "Share"
2. Klik "Publish library"
3. Tunggu publish selesai
4. Share link dengan tim
5. Tim bisa subscribe ke library untuk use components

---

## 🎯 CARA 2: Gunakan Figma Plugin

Jika Anda lebih suka otomatis, coba plugin ini:

### Plugin Yang Cocok:

1. **"Figma to React"** (untuk export ke React)
   - Install dari Figma Community
   - Buat components di Figma
   - Export langsung ke React code

2. **"Design to Code"** (untuk generate code)
   - Install dari Figma Community
   - Buat design di Figma
   - Generate Tailwind CSS code

3. **"Wireframe Kit"** (untuk wireframe cepat)
   - Siap pakai components
   - Hanya edit warna/text

### Cara Install Plugin:
1. Klik `Resources` (panel kiri atas)
2. Cari `Community` → `Plugins`
3. Search plugin yang diinginkan
4. Klik `Install`
5. Buka plugin dari menu

---

## 🎯 CARA 3: Gunakan Figma Tokens Plugin (Advanced)

Untuk design tokens management yang lebih baik:

1. **Install Plugin**: "Design Tokens" dari Figma Community
2. **Create Token File** dengan format JSON:
   ```json
   {
     "global": {
       "color-primary": { "value": "#3B82F6" },
       "color-cyan": { "value": "#06B6D4" },
       "spacing-xs": { "value": "4px" },
       "spacing-sm": { "value": "8px" },
       ...
     }
   }
   ```
3. **Import ke Figma** via plugin
4. **Apply tokens** ke components

---

## 📋 Checklist Setelah Import

- [ ] Colors setup (12 warna)
- [ ] Gradients setup (4 gradient)
- [ ] Typography styles (7 text styles)
- [ ] Button components (Primary, Secondary, Icon)
- [ ] Badge components (Priority, Status, Tag)
- [ ] TaskCard component
- [ ] Calendar components
- [ ] 3 wireframe screens
- [ ] Design tokens documented
- [ ] Publish library (jika untuk tim)

---

## 💡 Tips & Tricks

### Tip 1: Gunakan Auto Layout
- Select component → Klik `Auto Layout` (Shift+A)
- Settings: Horizontal, Gap 8px, Padding 16px
- Ini membuat component responsive otomatis

### Tip 2: Gunakan Constraints
- Untuk components yang perlu scale
- Right-click → `Constraints`
- Set horizontal/vertical scaling

### Tip 3: Gunakan Component Sets untuk Variants
- Select component → `Create component set`
- Otomatis buat variants dengan naming
- Lebih mudah di-maintain

### Tip 4: Export Assets
1. Select component
2. Right-click → `Export`
3. Pilih SVG (untuk icons)
4. Folder `exports` akan dibuat otomatis

### Tip 5: Share Prototype
1. Create frames untuk flow
2. Add interactions (klik button → next frame)
3. Share link prototype dengan stakeholder
4. Mereka bisa click-through preview

---

## 🔧 Troubleshooting

### Problem: Components tidak bisa di-edit

**Solution**: 
1. Component harus di-unfreeze dulu
2. Double-click component
3. Edit master component
4. Instances otomatis update

### Problem: Gradient tidak match

**Solution**:
1. Buka DESIGN_SYSTEM.md
2. Copy hex values persis
3. Use angle 135° untuk semua gradient
4. Test di light & dark mode

### Problem: File terlalu besar

**Solution**:
1. Hapus duplikasi components
2. Consolidate variants
3. Delete unused pages
4. Archive old versions

### Problem: Typing jadi lambat

**Solution**:
1. Reduce number of instances
2. Close unnecessary pages
3. Restart Figma
4. Use "Page History" untuk backup

---

## 📹 Video Tutorial Referensi

Jika stuck, tonton video ini:
- "Figma Basics" - Figma Official Channel
- "Figma Components & Variants" - Figma Official
- "Figma Design System" - various creators

---

## 🎉 Selesai!

Setelah ikuti semua step, Anda akan punya:
✅ Figma file dengan complete design system
✅ Reusable components
✅ 3 wireframe screens
✅ Color & typography library
✅ Siap untuk shared dengan tim

**Butuh bantuan?** Hubungi tim design atau check Figma community!

---

**Status**: ✅ Ready to Use
**Last Updated**: April 7, 2026
**Version**: 1.0.0
