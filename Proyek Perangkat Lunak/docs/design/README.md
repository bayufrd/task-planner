# Smart Task Planner - Design System & Component Library
## Complete Documentation Index

**Version**: 1.0.0  
**Last Updated**: April 7, 2026  
**Status**: ✅ Ready for Figma Import

---

## 📁 Documentation Files

### 1. **DESIGN_SYSTEM.md** 
Complete design system specifications covering all design tokens and patterns.

**Contents**:
- Color palette (primary, status, neutral, dark mode)
- Typography scale (8 levels: Display → Tiny)
- Spacing system (8 levels: xs → 4xl, based on 4px)
- Border radius scale (6 levels: sm → 3xl)
- Component specifications (6 major components)
- Interaction patterns (button states, transitions, animations)
- Responsive breakpoints (mobile, tablet, desktop)
- Accessibility guidelines (WCAG AA, keyboard navigation, focus states)
- Implementation guidelines (CSS conventions, Tailwind utilities)
- File organization reference
- Figma export structure

**How to use**:
1. Open in any markdown viewer
2. Reference color hex values for palette setup
3. Copy typography scale for typographic system
4. Apply spacing values to all layouts
5. Follow component specifications for design consistency

---

### 2. **WIREFRAMES.json**
Structured wireframe data in JSON format for Figma import.

**Screens Included**:
- Dashboard (1440x900) - Main application layout
- Command Palette (800x600) - Quick command modal
- Mobile View (375x812) - Responsive mobile layout

**Components Defined**:
- Header (1440x64) with logo, controls, language toggle
- Task Card (1408x90) with priority scoring
- Priority Badge (80x28) with variants
- Button variants (Primary, Secondary, Success)

**Data Structure**:
- x, y, width, height positioning for all elements
- Color definitions (5 colors with hex codes)
- Component variants and states
- Nested component hierarchy

**How to use**:
1. Import into Figma using "Assets" → "JSON" import
2. Or manually recreate components using coordinates and specs
3. Reference color definitions for palette
4. Scale coordinates to match artboard sizes

---

### 3. **COMPONENTS.md**
Detailed component library documentation with specifications and props.

**10 Components Documented**:
1. **Header** - Main navigation with language/theme toggle
2. **Calendar Timeline** - Month view with task indicators
3. **Command Palette** - Quick command execution modal
4. **Task Priority List** - Tasks with priority scoring
5. **Task Card** - Individual task with actions
6. **Language Toggle** - EN/ID switch with flags
7. **Button Variants** - Primary, Secondary, Icon buttons
8. **Badge Variants** - Priority, Status, Tag badges
9. **Empty State** - No tasks/data state UI
10. **Modal** - Base modal component specs

**For Each Component**:
- Overview and purpose
- Structure and hierarchy
- Detailed specifications (dimensions, colors, spacing)
- Props interface (TypeScript)
- Responsive behavior
- Color variants
- Interaction states

**How to use**:
1. Open for detailed component specifications
2. Find exact dimensions and colors
3. Review responsive breakpoints for each component
4. Check props and required data
5. Reference interaction states

---

### 4. **PREVIEW.html**
Interactive HTML preview of all components and design tokens.

**Includes**:
- All major components rendered
- Color palette visualization
- Spacing system visualization
- Typography samples
- Button and badge variations
- Task card example
- Calendar example
- Command palette mockup
- Design guidelines summary

**How to use**:
1. Open `PREVIEW.html` in web browser
2. View live rendered components
3. Inspect colors, spacing, typography
4. Reference for design consistency
5. Share with team for feedback

---

## 🎨 Design System Summary

### Color Palette
```
Primary:  #3B82F6 (Blue) → #06B6D4 (Cyan)
Success:  #10B981 (Green) → #059669 (Emerald)
Warning:  #F59E0B (Amber) → #D97706 (Orange)
Danger:   #DC2626 (Red) → #F97316 (Orange)
Neutral:  #F3F4F6 (Gray-100) → #111827 (Gray-950)
Dark BG:  #111827 (Gray-950)
Dark Text: #F9FAFB (Gray-50)
```

### Typography Scale
| Level | Size | Weight | Use Case |
|-------|------|--------|----------|
| Display | 32px | bold | Large headings |
| H1 | 28px | bold | Page titles |
| H2 | 24px | semibold | Section headers |
| H3 | 20px | semibold | Subsection headers |
| Body | 16px | normal | Main content |
| Small | 14px | normal | Secondary text |
| Tiny | 12px | medium | Labels/captions |

### Spacing System (4px base unit)
```
xs:  4px    (1x)
sm:  8px    (2x)
md:  16px   (4x)
lg:  24px   (6x)
xl:  32px   (8x)
2xl: 48px   (12x)
3xl: 56px   (14x)
4xl: 64px   (16x)
```

### Border Radius Scale
```
sm:   4px
md:   6px
lg:   8px
xl:   12px
2xl:  16px
3xl:  20px
full: 9999px
```

---

## 📱 Component Overview

### Layout Components
- **Header** (64px height)
  - Logo with gradient icon
  - Command palette button
  - Language toggle (EN/ID with flags)
  - Theme toggle (Moon/Sun)
  - Mobile hamburger menu

### Content Components
- **Calendar Timeline** (280px height)
  - Today quick view card
  - Month navigation
  - 7x6 calendar grid
  - Task count badges

- **Task Priority List**
  - View mode selector (Today/Upcoming/All)
  - Empty state with icon
  - Task list container
  - Statistics cards

- **Task Card** (90px height)
  - Status icon (TODO/IN_PROGRESS/DONE)
  - Task title and description
  - Priority badge (HIGH/MEDIUM/LOW)
  - Deadline with icon
  - Duration information
  - Action buttons (Done, Start/Pause, Delete)
  - Priority score box
  - Tag badges

### Interactive Components
- **Command Palette** (800x600 modal)
  - Search input with icon
  - Natural language suggestions
  - Slash commands
  - Command history
  - Help section

- **Badges**
  - Priority (colored gradients)
  - Status (blue, yellow, green)
  - Tags (blue accent)

- **Buttons**
  - Primary (gradient blue→cyan)
  - Secondary (gray)
  - Icon buttons

---

## 🎯 Getting Started with Figma

### Step 1: Import Design System
1. Open DESIGN_SYSTEM.md
2. Create color styles in Figma:
   - Primary, Success, Warning, Danger gradients
   - Neutral colors (gray scale)
   - Dark mode variants
3. Create typography styles using scale provided
4. Create spacing/grid styles for 4px base system

### Step 2: Import Wireframes
1. Use WIREFRAMES.json as reference
2. Create components with exact dimensions
3. Set up component variants (HIGH/MEDIUM/LOW priority)
4. Build responsive layouts for mobile/tablet/desktop
5. Add constraints for responsiveness

### Step 3: Build Components
1. Reference COMPONENTS.md for specifications
2. Create each component with documented props
3. Build variants (active, hover, disabled states)
4. Set up auto-layout for responsive sizing
5. Add component instances to frames

### Step 4: Create Frames
1. Dashboard frame (1440x900)
   - Place Header at top
   - Place Calendar below
   - Place Task List at bottom
   
2. Command Palette modal
   - Input section
   - Suggestions list
   - Help section

3. Mobile view (375x812)
   - Adapt all components for mobile
   - Hide desktop-only elements
   - Ensure touch targets (44x44px minimum)

### Step 5: Documentation
1. Add comments to components
2. Create component usage guide
3. Document interaction flows
4. Note keyboard shortcuts
5. Share with design team

---

## 🔧 Implementation Checklist

### Design System Setup ✅
- [x] Color palette defined
- [x] Typography scale defined
- [x] Spacing system defined
- [x] Border radius scale defined
- [x] Component specifications documented
- [x] Accessibility guidelines provided
- [x] Responsive breakpoints defined

### Component Documentation ✅
- [x] Header component specs
- [x] Calendar Timeline specs
- [x] Task Priority List specs
- [x] Task Card specs
- [x] Command Palette specs
- [x] Language Toggle specs
- [x] Button variants
- [x] Badge variants
- [x] Empty state specs
- [x] Modal specs

### Wireframe Documentation ✅
- [x] Dashboard layout (1440x900)
- [x] Command Palette layout (800x600)
- [x] Mobile layout (375x812)
- [x] Component definitions
- [x] Positioning specifications
- [x] Color definitions

### Preview & Reference ✅
- [x] HTML preview with rendered components
- [x] Color palette visualization
- [x] Spacing system visualization
- [x] Typography samples
- [x] Interactive examples
- [x] Design guidelines summary

---

## 📊 File Organization

All design files are organized in `docs/design/`:

```
docs/design/
├── DESIGN_SYSTEM.md      (400+ lines) - Design tokens & specifications
├── WIREFRAMES.json       (600+ lines) - Figma-importable structure
├── COMPONENTS.md         (500+ lines) - Component library documentation
├── PREVIEW.html          (600+ lines) - Interactive HTML preview
└── README.md            (this file)   - Documentation index
```

---

## 🚀 Integration with Development

### For Developers
1. Reference DESIGN_SYSTEM.md for color/typography values
2. Use COMPONENTS.md for component specifications
3. Follow spacing system for consistent padding/margins
4. Apply interaction patterns (200-300ms transitions)
5. Use Lucide React icons (w-4, w-5, w-6, strokeWidth 2)

### For Designers
1. Import DESIGN_SYSTEM.md into Figma for colors/typography
2. Use WIREFRAMES.json as layout reference
3. Build components per COMPONENTS.md specifications
4. Create variants for all component states
5. Document interaction flows
6. Share component library link with team

### For Product Managers
1. View PREVIEW.html for UI overview
2. Reference COMPONENTS.md for feature specs
3. Use WIREFRAMES.json for layout planning
4. Review DESIGN_SYSTEM.md for design guidelines
5. Coordinate with design/dev teams using shared specs

---

## 📝 Usage Examples

### Example 1: Adding a New Component
1. Open DESIGN_SYSTEM.md for color/spacing reference
2. Open COMPONENTS.md for similar component specs
3. Reference PREVIEW.html for visual style
4. Create component using documented specifications
5. Add to WIREFRAMES.json with coordinates

### Example 2: Updating Color Palette
1. Find color in DESIGN_SYSTEM.md
2. Update hex value
3. Update all component references in COMPONENTS.md
4. Update color definitions in WIREFRAMES.json
5. Update PREVIEW.html with new color
6. Sync with Figma color styles

### Example 3: Creating Mobile Layout
1. Reference responsive breakpoints in DESIGN_SYSTEM.md
2. Review mobile specs in WIREFRAMES.json (375x812)
3. Adjust component dimensions per COMPONENTS.md
4. Ensure touch targets are 44x44px minimum
5. Test on multiple device sizes

---

## 🎓 Design System Principles

### 1. Minimalism
- Clean, simple layouts
- Whitespace is important
- Remove unnecessary elements
- Focus on core functionality

### 2. Consistency
- Use defined color palette only
- Follow typography scale
- Apply spacing system consistently
- Use standard icon sizes

### 3. Accessibility
- WCAG AA contrast ratio (4.5:1)
- Keyboard navigation support
- Clear focus indicators
- Descriptive button labels

### 4. Responsiveness
- Mobile-first approach
- Flexible layouts with grid system
- Touch-friendly interface (44x44px minimum)
- Graceful degradation

### 5. Performance
- Minimal icon usage
- Optimized images
- Smooth animations (200-300ms)
- Lazy loading for images

---

## 📞 Support & Questions

### Common Questions

**Q: How do I import the wireframes into Figma?**
A: Open Figma, go to Assets → Add file → Select WIREFRAMES.json

**Q: Can I customize the colors?**
A: Yes, all colors are defined in DESIGN_SYSTEM.md. Update hex values and sync across all files.

**Q: What are the Lucide React icon sizes?**
A: Use w-4 (16px), w-5 (20px), or w-6 (24px) with strokeWidth 2

**Q: How do I ensure mobile responsiveness?**
A: Reference responsive breakpoints in DESIGN_SYSTEM.md and mobile layout in WIREFRAMES.json

**Q: Are the spacing values fixed or flexible?**
A: Based on 4px base unit system - scale as needed but maintain proportions

---

## 🔗 Related Files

### Source Code Files
- `src/components/layout/Header.tsx` - Header component implementation
- `src/components/calendar/CalendarTimeline.tsx` - Calendar component
- `src/components/tasks/TaskPriorityList.tsx` - Task list component
- `src/components/tasks/TaskCard.tsx` - Task card component
- `src/components/command/CommandPalette.tsx` - Command palette component
- `src/lib/i18n.ts` - Language/translation system

### Configuration Files
- `tailwind.config.ts` - Tailwind configuration with color/spacing tokens
- `package.json` - Dependencies (lucide-react icons)

---

## 📈 Version History

### v1.0.0 (April 7, 2026)
- ✅ Initial design system created
- ✅ Component library documented
- ✅ Wireframes structure defined
- ✅ HTML preview created
- ✅ All design tokens finalized
- ✅ Accessibility guidelines included
- ✅ Responsive breakpoints defined

---

## 📄 Export Instructions

### To Export as Figma File
1. Create new Figma file
2. Import color palette from DESIGN_SYSTEM.md
3. Import typography scale
4. Build components per COMPONENTS.md
5. Create frames per WIREFRAMES.json
6. Add component library page
7. Publish as shared library
8. Generate Figma link for team

### To Export as PDF
1. Open PREVIEW.html
2. Print to PDF (Ctrl+P)
3. Select "Save as PDF"
4. Share with team

### To Export as Design Spec
1. Combine all markdown files
2. Generate PDF from markdown
3. Include PREVIEW.html screenshots
4. Add Figma link reference
5. Distribute to team

---

**Last Updated**: April 7, 2026  
**Maintained By**: Design System Team  
**Status**: Active - v1.0.0

---

## 🎉 Next Steps

1. **Import into Figma**: Use these files as reference to build Figma design system
2. **Create Component Library**: Build reusable components in Figma
3. **Share with Team**: Publish Figma file for designers and developers
4. **Implement in Code**: Use specifications to implement components in React
5. **Maintain Documentation**: Keep files updated as design evolves

**Ready to start? Open PREVIEW.html in your browser first to see all components!**
