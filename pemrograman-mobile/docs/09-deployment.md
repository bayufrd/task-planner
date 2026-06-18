# Deployment Guide - Smart Task Planner Mobile

## Prerequisites

| Requirement | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime |
| npm/yarn | Latest | Package manager |
| Expo CLI | Latest | Development |
| EAS CLI | Latest | Build service |
| Expo Account | Free/Trial | Build submissions |
| Xcode | 15+ | iOS builds (macOS only) |
| Android Studio | Latest | Android builds |

## Development Setup

### 1. Install Dependencies

```bash
cd pemrograman-mobile
npm install
```

### 2. Configure Environment

Create `.env` file:
```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://taskplanner.dastrevas.com/api

# Optional: Cloudflare Turnstile (for captcha)
EXPO_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
```

### 3. Start Development Server

```bash
# Clear cache and start
npx expo start --clear

# Or with specific platform
npx expo start --ios
npx expo start --android
```

### 4. Run on Device

**Expo Go (Recommended for development):**
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Scan QR code from terminal
3. App reloads on code changes

**Development Build (for native features):**
```bash
npx expo run:ios
npx expo run:android
```

## Production Build

### 1. Configure EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure
```

### 2. Configure `app.json`

```json
{
  "expo": {
    "name": "Smart Task Planner",
    "slug": "smart-task-planner",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.dastrevas.smarttaskplanner",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "Camera for profile photo",
        "NSPhotoLibraryUsageDescription": "Photo library access"
      }
    },
    "android": {
      "package": "com.dastrevas.smarttaskplanner",
      "adaptiveIcon": {
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png"
      },
      "permissions": [
        "INTERNET",
        "CAMERA",
        "READ_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### 3. EAS Build Profiles

Create `eas.json`:
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    }
  }
}
```

### 4. Build Commands

**Development Build (local testing):**
```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

**Preview Build (testflight/play testing):**
```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

**Production Build:**
```bash
# iOS (App Store)
eas build --platform ios --profile production

# Android (Play Store)
eas build --platform android --profile production
```

## Build Variants

| Variant | Purpose | Distribution |
|---------|---------|--------------|
| Development | Local dev with Expo | Internal only |
| Preview | TestFlight/Internal | Internal + Testers |
| Production | Release | App Store/Play Store |

## App Store Submission

### iOS (App Store Connect)

1. After build completes, download from Expo dashboard
2. Upload to App Store Connect using Transporter
3. Complete store listing information
4. Submit for review

**Required Information:**
- App name: "Smart Task Planner"
- Category: Productivity
- Age rating: 4+
- Screenshots for all device sizes
- Privacy policy URL

### Android (Play Store)

1. After build completes, download AAB from Expo dashboard
2. Create app in Play Console
3. Upload AAB file
4. Complete store listing
5. Submit for review

**Required Information:**
- App name: "Smart Task Planner"
- Category: Productivity
- Content rating: Everyone
- Screenshots for phones/tablets
- Privacy policy URL

## Testing

### Manual Testing Checklist

| Feature | Test Case | Expected Result |
|---------|----------|----------------|
| Login | Enter valid credentials | Redirect to dashboard |
| Login | Enter invalid credentials | Show error message |
| Dashboard | View calendar | Calendar displays correctly |
| Dashboard | Select date | Tasks filter by date |
| Create Task | Fill all fields | Task created successfully |
| Create Task | Empty title | Validation error |
| Edit Task | Tap task card | Detail modal opens |
| Edit Task | Tap edit | Navigate to edit form |
| Complete Task | Tap done | Task marked complete |
| Delete Task | Tap delete | Confirmation shown |
| Logout | Tap logout | Redirect to login |
| Offline | No network | Cached data shown |

### Device Testing

Test on minimum supported versions:
- iOS: 13.4+
- Android: API 21+ (Android 5.0)

## Post-Deployment

### Monitoring
- Enable Crashlytics/Firebase in production
- Set up error tracking
- Monitor App Store ratings

### Updates
```bash
# Make code changes
# Rebuild
eas build --platform ios --profile production

# Or use OTA updates (no rebuild needed)
```

### Rollback
- Previous builds available in App Store Connect/Play Console
- Can reinstall previous version if issues found
