# Smart Study Planner Mobile

A mobile application built with React Native and Expo to help students prioritize tasks and generate automated study schedules.

## Tech Stack

- **Framework**: React Native + Expo (SDK 51+)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Data Fetching**: Axios + React Query
- **Styling**: NativeWind (Tailwind CSS)
- **Notifications**: Expo Notifications
- **Storage**: AsyncStorage
- **Forms**: React Hook Form + Zod

## Features

- **Authentication**: Secure login and registration.
- **Task Management**: Full CRUD for study tasks with difficulty and duration tracking.
- **Priority Engine**: Rule-based scoring system to determine task importance.
- **Auto Schedule**: Intelligent daily plan generation based on deadlines and priority.
- **Dashboard**: Visual progress tracking and completion statistics.
- **Local Notifications**: Reminders for tasks and daily study plans.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go app on your mobile device (for development)

### Installation

1. Clone the repository
2. Navigate to the mobile project directory:
   ```bash
   cd pemrograman-mobile
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the `pemrograman-mobile` directory:

```env
EXPO_PUBLIC_API_URL=http://your-backend-ip:8000/api
```

### Running the App

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to run the app.

## Project Structure

- `src/app`: Expo Router file-based navigation.
- `src/components`: Reusable UI components.
- `src/services`: API service layer using Axios.
- `src/store`: Global state management with Zustand.
- `src/utils`: Helper functions and priority engine logic.
- `src/notifications`: Local notification service.
- `src/types`: TypeScript interfaces and types.
