# Deployment Guide: Mobile App

## Development Mode

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Set API URL di `.env`:
    ```env
    EXPO_PUBLIC_API_URL=http://your-server-ip:8000/api
    ```
3.  Jalankan Expo:
    ```bash
    npx expo start
    ```

## Production Build (Android/iOS)

Sistem menggunakan **EAS (Expo Application Services)** untuk build:

### 1. Configure EAS
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### 2. Build Android (APK/AAB)
```bash
eas build --platform android --profile production
```

### 3. Build iOS
```bash
eas build --platform ios --profile production
```

## Requirements
*   Node.js v18+
*   Expo Go (untuk testing)
*   Akun Expo (untuk build)
