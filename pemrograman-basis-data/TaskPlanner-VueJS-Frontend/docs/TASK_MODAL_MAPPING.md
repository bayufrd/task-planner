# Task Modal UI Mapping: Next.js → VueJS

## Overview
Comparison of task creation/edit modal UI patterns between Next.js [`TaskModal.tsx`](proyek-perangkat-lunak/src/components/tasks/TaskModal.tsx) and VueJS [`TaskForm.vue`](pemrograman-basis-data/TaskPlanner-VueJS-Frontend/src/components/TaskForm.vue).

---

## Architecture Differences

| Aspect | Next.js (Next.js) | VueJS |
|--------|-------------------|-------|
| **Pattern** | Multi-step wizard | Single-page form |
| **Approach** | Step-by-step with portal modal | Inline form with review panel |
| **Styling** | Tailwind utility classes | CSS classes + external CSS |

---

## Next.js TaskModal Structure

### 1. Props Interface
```typescript
interface TaskModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  task?: Task | null
  onClose: () => void
  onSaved?: () => void | Promise<void>
  onCreated?: () => void | Promise<void>
}
```

### 2. Step Configuration
```typescript
type TaskStep = 'title' | 'description' | 'date' | 'time' | 'priority' | 'duration' | 'review'

const TASK_STEPS = [
  { key: 'title', label: 'Task Title', helper: 'Start from the main task name first.' },
  { key: 'description', label: 'Description', helper: 'Add optional context if you need it.' },
  { key: 'date', label: 'Date', helper: 'Pick the day for this task.' },
  { key: 'time', label: 'Time', helper: 'Choose the most suitable time slot.' },
  { key: 'priority', label: 'Priority', helper: 'Set how urgent this task is.' },
  { key: 'duration', label: 'Duration', helper: 'Estimate how long this task should take.' },
  { key: 'review', label: 'Review', helper: 'Check the details before saving.' },
]
```

### 3. State Management
- `title`, `description`, `priority`, `deadline`, `deadlineTime`, `estimatedDuration`
- `currentStep` - tracks wizard position
- `isLoading` - loading state

### 4. Modal Structure (Portal-based)
```tsx
return createPortal(
  <div className="fixed inset-0 z-[99999] flex items-end justify-center p-0 sm:items-center sm:p-6 md:p-8">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl shadow-2xl sm:rounded-3xl">
      {/* Header */}
      <div className="border-b px-5 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">
              Step {currentStep + 1} of {TASK_STEPS.length}
            </p>
            <h2>{isCreate ? 'Create Task' : 'Edit Task'}</h2>
          </div>
          <button onClick={onClose}><X /></button>
        </div>
        {/* Progress bar */}
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" 
               style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h3 className="text-2xl font-bold">{currentConfig.label}</h3>
        <p className="text-sm text-gray-400">{currentConfig.helper}</p>
        {renderStep()}
      </div>
      
      {/* Footer */}
      <div className="border-t px-5 py-4">
        <div className="flex items-center gap-3">
          <button onClick={currentStep === 0 ? onClose : goBack}>
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          <button type="submit" disabled={!canContinue}>
            {isLastStep ? 'Create Task' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body
)
```

### 5. Step Renderers

**Title Step:**
```tsx
<div className="space-y-4">
  <label>Task Title <span className="text-red-500">*</span></label>
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="e.g., Finish project report"
    className="w-full rounded-2xl border px-4 py-4 text-base"
    autoFocus
  />
</div>
```

**Description Step:**
```tsx
<textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Optional: add notes, context, or a quick reminder..."
  rows={5}
  className="w-full rounded-2xl border px-4 py-4 text-base"
/>
```

**Priority Step:**
```tsx
{priorityOptions.map((option) => (
  <button
    key={option.value}
    type="button"
    onClick={() => setPriority(option.value)}
    className={`w-full rounded-2xl border px-4 py-4 text-left ${
      active
        ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-500/20'
        : 'border-gray-700 bg-gray-800 text-gray-100'
    }`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="font-semibold">{option.label}</p>
        <p className="text-sm opacity-80">{option.hint}</p>
      </div>
      {active && <Check />}
    </div>
  </button>
))}
```

**Duration Step:**
```tsx
<div className="space-y-4">
  <label>Duration (minutes)</label>
  <input type="number" min="5" step="5" value={estimatedDuration} />
  <div className="grid grid-cols-3 gap-2">
    {['30', '60', '90'].map((minutes) => (
      <button
        key={minutes}
        type="button"
        onClick={() => setEstimatedDuration(minutes)}
        className="rounded-xl border px-3 py-3 text-sm font-medium"
      >
        {minutes} min
      </button>
    ))}
  </div>
</div>
```

**Review Step:**
```tsx
{[
  { label: 'Task Title', value: title || '-' },
  { label: 'Description', value: description || 'No description' },
  { label: 'Date', value: deadline },
  { label: 'Time', value: deadlineTime },
  { label: 'Priority', value: priority },
  { label: 'Duration', value: `${estimatedDuration} min` },
].map((item) => (
  <div key={item.label} className="rounded-2xl border px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide">{item.label}</p>
    <p className="mt-1 text-sm">{item.value}</p>
  </div>
))}
```

### 6. Dark/Light Theme Support
```tsx
{theme === 'dark'
  ? 'bg-gray-900 border-gray-800 text-white'
  : 'bg-white border-gray-200 text-gray-900'}
```

### 7. Component Dependencies
- [`CalendarPicker`](proyek-perangkat-lunak/src/components/ui/CalendarPicker.tsx) - date selection
- [`TimeSlotPicker`](proyek-perangkat-lunak/src/components/ui/TimeSlotPicker.tsx) - time selection

---

## VueJS TaskForm Structure

### 1. Props
```typescript
props: {
  modelValue?: Partial<Task>
  submitLabel: string
  busy?: boolean
  mode?: 'create' | 'edit'
}
```

### 2. State (reactive)
```typescript
const form = reactive({
  title: '',
  description: '',
  deadline: toLocalInputValue(),
  priority: 'MEDIUM' as TaskPriority,
  estimatedDuration: 60,
})
```

### 3. Form Template Structure
```vue
<form class="form-panel task-modal-form-next" @submit.prevent="submit">
  <div class="task-modal-progress">
    <span>{{ mode === 'edit' ? 'Edit Task' : 'Create Task' }}</span>
    <strong>Review details before saving</strong>
  </div>
  
  <!-- Review Grid -->
  <div class="task-modal-review-grid">
    <article>
      <span>Task Title</span>
      <strong>{{ form.title || '-' }}</strong>
    </article>
    <article>
      <span>Priority</span>
      <strong>{{ form.priority }}</strong>
    </article>
    <article>
      <span>Deadline</span>
      <strong>{{ form.deadline || '-' }}</strong>
    </article>
    <article>
      <span>Duration</span>
      <strong>{{ form.estimatedDuration || 60 }} min</strong>
    </article>
  </div>
  
  <!-- Form Grid -->
  <div class="form-grid task-modal-form-grid-next">
    <label>
      <span>Title</span>
      <input v-model="form.title" required placeholder="Finish weekly report" />
    </label>
    <label>
      <span>Deadline</span>
      <input v-model="form.deadline" required type="datetime-local" />
    </label>
    <label class="full-width">
      <span>Description</span>
      <textarea v-model="form.description" rows="4" placeholder="Task details"></textarea>
    </label>
    <label>
      <span>Priority</span>
      <select v-model="form.priority">
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </label>
    <label>
      <span>Estimated duration (minutes)</span>
      <input v-model="form.estimatedDuration" min="5" step="5" type="number" />
    </label>
  </div>
  
  <button class="primary-button" :disabled="busy">
    {{ busy ? 'Saving...' : submitLabel }}
  </button>
</form>
```

---

## Field Mapping

| Field | Next.js | VueJS |
|-------|---------|-------|
| Title | `title` (string) | `form.title` |
| Description | `description` (string) | `form.description` |
| Deadline | `deadline` + `deadlineTime` (separate) | `form.deadline` (datetime-local) |
| Priority | `priority` ('HIGH'/'MEDIUM'/'LOW') | `form.priority` |
| Duration | `estimatedDuration` (minutes) | `form.estimatedDuration` |

---

## Required CSS Classes (VueJS)

To match Next.js styling, VueJS needs:

```css
/* Modal wrapper */
.fixed.inset-0.z-\[99999\].flex.items-center.justify-center

/* Backdrop */
.bg-black\/60.backdrop-blur-sm

/* Modal container */
.w-full.max-w-lg.overflow-hidden.rounded-3xl.shadow-2xl

/* Header */
.border-b.px-6.py-4

/* Step indicator */
.text-xs.font-semibold.uppercase.tracking-\[0\.22em\]

/* Progress bar */
.h-2.overflow-hidden.rounded-full.bg-gray-200
.bg-gradient-to-r.from-blue-600.to-indigo-600

/* Form inputs */
.w-full.rounded-2xl.border.px-4.py-4.text-base

/* Priority buttons */
.w-full.rounded-2xl.border.px-4.py-4.text-left

/* Review cards */
.rounded-2xl.border.px-4.py-3

/* Footer buttons */
.min-h-12.rounded-2xl.px-4.py-3.font-medium

/* Primary button gradient */
.bg-gradient-to-r.from-blue-600.to-indigo-600
```

---

## Key Differences to Adapt

1. **Wizard vs Single Form**: Next.js uses 7-step wizard; VueJS uses single-page with review panel
2. **Date/Time**: Next.js separates date/time into distinct steps with custom pickers
3. **Priority Selection**: Next.js uses card-style buttons with hints; VueJS uses dropdown
4. **Theme**: Next.js has explicit dark/light mode classes; VueJS needs same pattern
5. **Modal**: Next.js uses React portal; VueJS likely uses Teleport or custom modal component

---

## Recommended VueJS Implementation

To match Next.js exactly:

1. Create multi-step component with `currentStep` state
2. Use Tailwind-style CSS classes
3. Separate date/time pickers like Next.js
4. Add card-style priority selector
5. Add progress bar and step indicators
6. Add dark/light theme support
7. Use Vue Teleport for modal portal
