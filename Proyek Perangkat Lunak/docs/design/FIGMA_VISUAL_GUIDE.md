# 📸 VISUAL FIGMA IMPORT GUIDE

**Versi dengan screenshot step-by-step untuk clarity maksimal**

---

## 🚀 MULAI SEKARANG - 5 STEP PALING CEPAT

### STEP 1: Buat Figma File

```
1. Buka figma.com
2. Klik "New file" (tombol biru besar)
3. Beri nama: "Task Planner - Design System"
4. Workspace: Personal / Team (bebas)
5. Klik "Create"

[SCREENSHOT AREA]
┌─────────────────────────────────┐
│  Figma                    ⚙️     │
│  ✕ New file                     │
│     ↲ ✓                         │
│     (blank file siap edit)      │
└─────────────────────────────────┘

Kamu akan melihat:
- Canvas kosong di tengah (tempat design)
- Panel "Assets" di kiri (untuk colors/components)
- Panel "Design" di kanan (untuk properties)
- Toolbar di atas (untuk tools)
```

---

### STEP 2: Setup Warna (5 menit)

**Panel Assets di kiri bawah → klik tab "Assets"**

```
[SCREENSHOT AREA]
┌─────────────┬──────────────────┐
│ Assets      │                  │
│ ☐ ◯ S       │  Canvas          │
│             │                  │
│ [+] Colors  │                  │
│ [+] Compon. │                  │
│ [+] Typo.   │                  │
└─────────────┴──────────────────┘

Urutan yang harus dilakukan:

1️⃣ BUAT RECTANGLE (untuk setup color)
   - Toolbar atas: klik "Rectangle" (atau R)
   - Drag di canvas: buat rectangle 100×100
   
2️⃣ SETUP GRADIENT COLOR
   - Select rectangle
   - Panel kanan → "Design"
   - Cari "Fill" section
   - Klik warna box → pilih "Gradient"
   - Ubah:
     - Start color: #3B82F6 (blue)
     - End color: #06B6D4 (cyan)
     - Angle: 135
   
3️⃣ SAVE SEBAGAI STYLE
   - Di "Fill" section, klik "+" icon
   - Beri nama: "Primary/Gradient"
   - Klik "Create style"

4️⃣ DELETE RECTANGLE
   - Select rectangle
   - Delete (atau press Delete key)

5️⃣ REPEAT UNTUK SEMUA WARNA
   (Copy-paste warna dari FIGMA_QUICK_START.md)
```

**Warna yang perlu di-setup:**

```
🔵 PRIMARIES (2):
   1. Primary/Blue = #3B82F6
   2. Primary/Cyan = #06B6D4

✅ SUCCESS (2):
   3. Success/Green = #10B981
   4. Success/Emerald = #059669

⚠️ WARNING (2):
   5. Warning/Amber = #F59E0B
   6. Warning/Orange = #D97706

🔴 DANGER (2):
   7. Danger/Red = #DC2626
   8. Danger/Orange = #F97316

⚪ NEUTRAL (3):
   9. Neutral/Gray-100 = #F3F4F6
   10. Neutral/Gray-500 = #6B7280
   11. Neutral/Gray-950 = #111827

💫 GRADIENTS (4 - optional tapi recommended):
   12. Gradient/Primary = #3B82F6 → #06B6D4
   13. Gradient/Success = #10B981 → #059669
   14. Gradient/Warning = #F59E0B → #D97706
   15. Gradient/Danger = #DC2626 → #F97316
```

---

### STEP 3: Setup Typography (5 menit)

```
[SCREENSHOT AREA]
┌─────────────┬──────────────────┐
│ Assets      │                  │
│ ☐ ◯ A       │  Canvas          │
│             │  "Hello"         │
│ [+] Colors  │  (text buat di)  │
│ [+] Typo.   │                  │
└─────────────┴──────────────────┘

Langkah:

1️⃣ BUAT TEXT
   - Toolbar atas: klik "Text" (atau T)
   - Click di canvas
   - Type: "Heading 1"

2️⃣ SETUP TYPOGRAPHY
   - Panel kanan → "Design"
   - Set value:
     Font: Inter (atau Roboto)
     Size: 28
     Weight: Bold (700)
     Line height: 36
     
3️⃣ SAVE SEBAGAI STYLE
   - Di panel kanan, cari "Text" section
   - Klik "+" icon
   - Beri nama: "H1/28"
   - Klik "Create style"

4️⃣ DELETE TEXT
   - Press Delete

5️⃣ REPEAT UNTUK:
   - Display/32 (size 32, bold)
   - H1/28 (size 28, bold)
   - H2/24 (size 24, semibold)
   - H3/20 (size 20, semibold)
   - Body/16 (size 16, regular)
   - Small/14 (size 14, regular)
   - Tiny/12 (size 12, medium)
```

---

### STEP 4: Buat Components

#### Component 1: Button - Primary

```
[SCREENSHOT AREA]
┌─────────────────────────────┐
│ [PRIMARY BUTTON VISUAL]     │
│ ┌──────────────┐            │
│ │ Add Task     │ (gradient) │
│ └──────────────┘            │
│ (120 × 40px)                │
└─────────────────────────────┘

LANGKAH:

1️⃣ BUAT FRAME
   - Toolbar: klik "Frame" (atau F)
   - Canvas: buat 120 × 40
   - Name: "Button/Primary"

2️⃣ BUAT RECTANGLE (button bg)
   - Inside frame: buat rectangle 120 × 40
   - Fill: Primary Gradient (#3B82F6 → #06B6D4)
   - Corner radius: 12
   - Delete stroke (jika ada)

3️⃣ TAMBAH TEXT
   - Add text: "Button"
   - Center align (horizontal)
   - Color: white
   - Style: Body (apply text style)

4️⃣ SETUP AUTO LAYOUT
   - Select frame
   - Toolbar: Shift+A (auto layout)
   - Settings:
     - Direction: Horizontal
     - Gap: 8
     - Align: center

5️⃣ BUAT COMPONENT
   - Select frame
   - Right-click → "Create component"
   - Atau: Toolbar → Klik "component" icon
   - Figma otomatis membuat component

6️⃣ BUAT VARIANTS (OPTIONAL tapi recommended)
   - Right-click component → "Create component set"
   - Add variant button (di layer panel)
   - Create states:
     a. Normal (sudah ada)
     b. Hover (add shadow, scale 105%)
     c. Disabled (opacity 50%)
```

#### Component 2: Badge - Priority

```
[SCREENSHOT AREA]
┌──────────────────────────────┐
│ [BADGE HIGH]  [BADGE MED]   │
│ ┌────────┐   ┌────────┐     │
│ │ HIGH   │   │ MEDIUM │     │
│ └────────┘   └────────┘     │
│ (80 × 28px)                  │
└──────────────────────────────┘

LANGKAH (SAMA DENGAN BUTTON):

1️⃣ Buat frame 80 × 28
2️⃣ Buat rectangle dengan:
   - HIGH: Danger gradient (#DC2626 → #F97316)
   - Text: "HIGH" (white)
   - Corner radius: 8
3️⃣ Setup auto layout
4️⃣ Make as component
5️⃣ Create variants untuk:
   - HIGH (red gradient)
   - MEDIUM (yellow gradient)
   - LOW (green gradient)
```

#### Component 3: Task Card (PALING PENTING!)

```
[SCREENSHOT AREA]
┌────────────────────────────────────────┐
│ ✅ Design landing page        │ Score  │
│    Create responsive design   │  92    │
│    Deadline: Apr 10           │        │
│    Priority: HIGH  2 days     │ ✓ ▶ 🗑 │
│ #design                       │        │
└────────────────────────────────────────┘
(1408 × 90px)

LANGKAH:

1️⃣ CREATE FRAME
   - Size: 1408 × 90
   - Name: "TaskCard"
   - Fill: white
   - Border: left 4px, #3B82F6
   - Corner radius: 12

2️⃣ SETUP AUTO LAYOUT
   - Select frame
   - Shift+A
   - Direction: Horizontal
   - Gap: 16
   - Padding: 16

3️⃣ LEFT SECTION (flex-grow)
   Create sub-frame:
   - Size: flexible (flex-grow: 1)
   - Auto layout: vertical, gap 8
   
   Content:
   a. Horizontal group (status icon + title):
      - Icon: "✅" (36×36)
      - Title: "Design landing page" (apply H3/20 style)
   
   b. Description: "Create responsive..." (apply Small/14)
   
   c. Meta badges (horizontal group):
      - Priority badge (use Badge component)
      - Deadline: "Apr 10"
      - Days: "2 days"
      - Tags: "#design"
   
4️⃣ RIGHT SECTION (fixed width)
   Create sub-frame:
   - Size: 160 × 60 (fixed)
   - Auto layout: vertical
   
   Content:
   a. Score box:
      - Fill: Primary gradient
      - Corner radius: 8
      - Text: "92" (size 24, bold, white)
      - Label: "Priority Score" (size 12, white)
   
   b. Action buttons (horizontal):
      - Done (✓)
      - Play (▶️)
      - Delete (🗑️)
      - Each: 32 × 32, icon centered

5️⃣ MAKE AS COMPONENT
   - Select top frame
   - Right-click → "Create component"

6️⃣ CREATE VARIANTS
   - Right-click → "Create component set"
   - Add variants for:
     - Status: TODO | IN_PROGRESS | DONE
     - Priority: HIGH | MEDIUM | LOW
   - Total: 9 variants (3×3)
```

---

### STEP 5: Buat Wireframe Screens

#### Screen 1: Dashboard (1440 × 900)

```
[SCREENSHOT AREA - FULL LAYOUT]
┌────────────────────────────────────────┐
│ HEADER (1440 × 64)                     │
├────────────────────────────────────────┤
│                                        │
│ CALENDAR (1440 × 280)                  │
│                                        │
├────────────────────────────────────────┤
│                                        │
│ TASKS (1440 × 556)                     │
│ ┌──────────────────────────────────┐  │
│ │ ✅ Task 1              [Score]   │  │
│ ├──────────────────────────────────┤  │
│ │ ✅ Task 2              [Score]   │  │
│ ├──────────────────────────────────┤  │
│ │ ✅ Task 3              [Score]   │  │
│ └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘

LANGKAH:

1️⃣ CREATE FRAME 1440 × 900
   - Name: "Dashboard - Main"

2️⃣ ADD HEADER (dari komponen atau manual)
   - Position: 0, 0
   - Size: 1440 × 64
   - Content:
     - Logo "📅 Task Planner"
     - Search button
     - EN/ID toggle
     - Theme toggle
     - Menu

3️⃣ ADD CALENDAR SECTION
   - Position: 0, 64
   - Size: 1440 × 280
   - Content:
     - Today card (gradient)
     - Month nav
     - 7×6 calendar grid

4️⃣ ADD TASK LIST SECTION
   - Position: 0, 344
   - Size: 1440 × 556
   - Content:
     - View selector (Today/Upcoming/All)
     - Task card instances (stacked)
     - Min 3 task examples

5️⃣ SET CONSTRAINTS
   - Select each section
   - Right-click → "Constraints"
   - Header: left, right, top
   - Calendar: left, right
   - Tasks: left, right, top, bottom
   - (Ini untuk responsiveness)
```

#### Screen 2: Command Palette Modal (800 × 600)

```
[SCREENSHOT AREA - MODAL]
        (OVERLAY - blur background)
    ┌────────────────────────────┐
    │  🔍 Search or type /      ✕│
    ├────────────────────────────┤
    │ 💡 add meeting tomorrow    │
    │ 🎯 /add [title]           │
    │ ↳ add project deadline     │
    │ ?️ help                    │
    └────────────────────────────┘
    (800 × 600px)

LANGKAH:

1️⃣ CREATE FRAME 800 × 600
   - Name: "CommandPalette"
   - Background: white
   - Corner radius: 16
   - Shadow: shadow-2xl

2️⃣ INPUT SECTION (top)
   - Height: 60px
   - Fill: Primary gradient
   - Corner radius: 16
   - Content:
     - Search icon (left)
     - Input field (center)
     - Close X button (right)

3️⃣ SUGGESTIONS LIST (middle)
   - Height: ~400px
   - Scrollable area
   - Add 3-5 suggestion items:
     a. Natural language (💡 icon)
     b. Slash command (🎯 icon)
     c. History item (↳ icon)

4️⃣ HELP SECTION (bottom)
   - Background: gray-100
   - Two columns:
     - Natural Language help
     - Slash Commands help

5️⃣ OVERLAY (background)
   - Create rectangle: full screen size
   - Fill: black
   - Opacity: 40%
   - Send to back (Ctrl+[)
```

---

## 🎯 SHORTCUT KEYS PENTING

```
🖱️ SELECTION & VIEW
   V              = Select / Pointer
   Space+Drag     = Pan canvas
   Ctrl+Z         = Undo
   Ctrl+Shift+Z   = Redo
   Ctrl+1         = Zoom to 100%
   Shift+1        = Zoom to fit all

🎨 CREATE
   R              = Rectangle
   T              = Text
   F              = Frame
   C              = Circle/Ellipse
   L              = Line
   Pen            = Draw path

🛠️ EDIT
   Ctrl+Duplicate = Quick copy
   Shift+A        = Auto layout
   Ctrl+G        = Group
   Ctrl+Shift+G  = Ungroup
   Shift+R       = Rotate
   Ctrl+D        = Duplicate

💾 SAVE & EXPORT
   Ctrl+S        = Save
   Shift+Ctrl+S  = Save to local
   Ctrl+E        = Export
```

---

## ❌ COMMON MISTAKES & FIXES

### ❌ Mistake 1: Buat components tapi bukan sebagai component

```
❌ WRONG:
   - Buat rectangle, text, group
   - Jangan di-convert jadi component
   - Nanti susah di-reuse

✅ RIGHT:
   - Setelah design selesai
   - Select frame/group
   - Right-click → "Create component"
   - Atau use Figma main menu
```

### ❌ Mistake 2: Langsung edit banyak instances

```
❌ WRONG:
   - Create component
   - Edit instances satu-satu
   - Perubahan tidak sync

✅ RIGHT:
   - Edit MAIN component (double-click)
   - Semua instances auto-update
   - Hanya edit instances untuk perbedaan kecil
```

### ❌ Mistake 3: Tidak setup auto layout

```
❌ WRONG:
   - Manual position tiap element
   - Resize jadi berantai-antai error
   - Responsive layout susah

✅ RIGHT:
   - Select frame
   - Shift+A (auto layout)
   - Elements auto-position
   - Responsive jadi mudah
```

### ❌ Mistake 4: Gradient direction salah

```
❌ WRONG:
   - Gradient direction random
   - Tidak konsisten antar components

✅ RIGHT:
   - Semua gradient angle: 135° (bottom-right)
   - Konsisten di semua components
   - Copy dari FIGMA_QUICK_START.md
```

---

## ✅ QUALITY CHECKLIST

Sebelum selesai, cek ini:

```
COLORS:
□ Semua 11 colors di-setup
□ Semua 4 gradients di-setup
□ Colors dengan naming konsisten

TYPOGRAPHY:
□ Semua 7 text styles di-setup
□ Font konsisten (Inter atau Roboto)
□ Sizes sesuai spec (Display 32, H1 28, dll)

COMPONENTS:
□ Button/Primary ada
□ Button/Secondary ada
□ Badge/Priority ada (dengan 3 variants)
□ TaskCard ada (dengan 9 variants)
□ Semua components ADALAH components (bukan groups)

WIREFRAMES:
□ Dashboard frame 1440 × 900
□ CommandPalette frame 800 × 600
□ Mobile frame 375 × 812 (optional)
□ Semua sections properly positioned

NAMING:
□ Files, frames, components punya nama jelas
□ Naming konsisten (button/primary, not "btn", "button 1", dll)
□ Layers organized (folder/groups jelas)

CONSTRAINTS:
□ Responsiveness di-test (resize canvas)
□ Elements tidak overlap saat resize
□ Layout look good di berbagai ukuran
```

---

## 🎯 AFTER IMPORT - NEXT STEPS

### 1. Share dengan Team

```
1. Klik "Share" button (atas kanan)
2. Copy link
3. Share dengan team
4. Set permission: "View" atau "Edit"
```

### 2. Publish Library

```
1. File menu → "Publish library"
2. Set version number
3. Team bisa subscribe & use components
4. Update library = semua projects update
```

### 3. Create Prototype

```
1. Select frame
2. Tab "Prototype" (atas kanan)
3. Click button → set destination
4. Test dengan preview
5. Share prototype link
```

### 4. Hand-off to Developers

```
1. Share Figma link
2. Developers buka dengan plugin:
   - Figma to Code
   - Design to React
   - Measure
3. Developers extract specs & code
```

---

## 🎉 DONE!

Kalau semua step selesai, Anda udah punya:

✅ Complete design system di Figma
✅ Reusable components
✅ Wireframe screens
✅ Ready for team collaboration
✅ Handoff-ready untuk developers

---

**Next?**
- Share file dengan team
- Get feedback
- Iterate design
- Export to code

---

**Created**: April 7, 2026  
**Status**: ✅ Ready to Use  
**Time Estimate**: 1-2 hours
