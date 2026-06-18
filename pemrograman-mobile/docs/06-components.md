# Component Library - Smart Task Planner Mobile

## Overview

Reusable UI components for the mobile app, built with React Native and styled with StyleSheet.

## Component List

| Component | Category | Description |
|-----------|----------|-------------|
| ConfirmationModal | Modal | Delete/Done confirmation dialog |
| SuccessModal | Modal | Success feedback popup |
| TaskDetailModal | Modal | Full task view with actions |
| Turnstile | Form | Captcha widget |
| WebViewAuth | Auth | OAuth webview wrapper |

---

## ConfirmationModal

### Purpose
Shows confirmation dialog before destructive actions (delete, mark done).

### Props
```typescript
interface ConfirmationModalProps {
  visible: boolean;           // Modal visibility
  type: 'done' | 'delete';    // Action type
  taskTitle: string;          // Task name for context
  onConfirm: () => void;      // Confirm callback
  onCancel: () => void;       // Cancel callback
}
```

### Usage
```tsx
<ConfirmationModal
  visible={showModal}
  type="delete"
  taskTitle="Submit Report"
  onConfirm={handleDelete}
  onCancel={() => setShowModal(false)}
/>
```

### Styling
- Overlay: `rgba(0, 0, 0, 0.6)` background
- Modal: White background, `borderRadius: 24`
- Icon: Trash2 (delete) or CheckCircle2 (done)
- Buttons: Primary (danger blue/green) and Secondary (gray)

---

## SuccessModal

### Purpose
Displays success feedback after an action, auto-closes after delay.

### Props
```typescript
interface SuccessModalProps {
  visible: boolean;           // Modal visibility
  title: string;             // Success message title
  message?: string;          // Optional description
  onClose: () => void;       // Close callback
  autoCloseDelay?: number;   // Auto-close ms (default: 2000)
}
```

### Usage
```tsx
<SuccessModal
  visible={showSuccess}
  title="Task Created!"
  message="Your new task has been added."
  onClose={() => router.back()}
/>
```

### Styling
- Logo display at top
- CheckCircle2 icon (green)
- Fade animation on appear
- Auto-dismiss timer

---

## TaskDetailModal

### Purpose
Shows full task details with action buttons (Edit, Done, Delete).

### Props
```typescript
interface TaskDetailModalProps {
  visible: boolean;
  task: {
    id: string;
    title: string;
    description?: string;
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
    deadline?: string;
    estimatedDuration?: number;
    status?: string;
    tags?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  } | null;
  onClose: () => void;
  onEdit: () => void;
  onDone: () => void;
  onDelete: () => void;
}
```

### Usage
```tsx
<TaskDetailModal
  visible={showDetail}
  task={selectedTask}
  onClose={() => setShowDetail(false)}
  onEdit={handleEdit}
  onDone={handleDone}
  onDelete={handleDelete}
/>
```

### Display Fields
| Field | Icon | Color |
|-------|------|-------|
| Priority | Zap | RED/YELLOW/GREEN |
| Due Date | Calendar | Blue |
| Due Time | Clock | Purple |
| Duration | Timer | Amber |
| Difficulty | Zap | Gray |
| Tags | Tag | Green |

### Action Buttons
| Button | Icon | Color | Style |
|--------|------|-------|-------|
| Edit | Edit3 | Blue | Secondary (light bg) |
| Done | Check | White | Primary (green bg) |
| Delete | Trash2 | Red | Ghost (light red bg) |

---

## WebViewAuth

### Purpose
In-app browser for OAuth authentication (Google Sign-In).

### Props
```typescript
interface WebViewAuthProps {
  onSuccess: (token: string, user: User) => void;
  onError: (error: string) => void;
}
```

### Usage
```tsx
<WebViewAuth
  onSuccess={(token, user) => {
    setAuth(token, user);
    router.replace('/(main)');
  }}
  onError={(error) => Alert.alert('Error', error)}
/>
```

### Features
- Loading overlay during OAuth
- Error handling with retry button
- Message listener for token extraction
- Navigation state tracking

### State
```typescript
interface WebViewAuthState {
  loading: boolean;      // Loading indicator
  error: boolean;        // Error state
  url: string;           // Current URL
}
```

---

## Turnstile

### Purpose
Cloudflare Turnstile captcha widget for forms.

### Props
```typescript
interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
}
```

### Usage
```tsx
<Turnstile
  siteKey={TURNSTILE_SITE_KEY}
  onVerify={(token) => setCaptchaToken(token)}
  onError={() => Alert.alert('Captcha Error')}
/>
```

---

## Common Patterns

### Modal Wrapper
All modals follow this pattern:
```tsx
<Modal
  visible={visible}
  transparent
  animationType="fade" // or "slide"
  onRequestClose={onClose}
>
  <View style={styles.overlay}>
    <View style={styles.modalContent}>
      {/* Content */}
    </View>
  </View>
</Modal>
```

### Touchable Opacity Button
```tsx
<TouchableOpacity
  style={[styles.button, isDisabled && styles.buttonDisabled]}
  onPress={handlePress}
  disabled={isDisabled}
>
  <Text style={styles.buttonText}>Label</Text>
</TouchableOpacity>
```

### Icon + Text Button
```tsx
<TouchableOpacity style={styles.button}>
  <Icon name="check" size={18} color="#fff" />
  <Text style={styles.buttonText}>Button</Text>
</TouchableOpacity>
```

---

## Color Constants

```typescript
export const colors = {
  // Primary
  primary: '#3b82f6',
  primaryLight: '#eff6ff',

  // Status
  success: '#22c55e',
  warning: '#f97316',
  danger: '#ef4444',

  // Priority
  priorityHigh: '#ef4444',
  priorityMedium: '#f59e0b',
  priorityLow: '#22c55e',

  // Text
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',

  // Background
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc',
  bgBorder: '#e2e8f0',
};
```
