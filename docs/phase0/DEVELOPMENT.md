# Setup & Development Guide

## 🚀 Initial Setup

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- MySQL server running (v5.7+)
- VS Code (recommended)

### 2. Install Dependencies

Wait for npm install to complete (this may take 2-5 minutes):

```bash
cd d:\project-repo\bot-schedular
npm install
```

If npm install is slow, you can try yarn:
```bash
yarn install
```

### 3. Database Setup

**Generate Prisma client:**
```bash
npm run prisma:generate
```

**Create migration (first time only):**
```bash
npm run prisma:migrate
```

This will:
- Create the database schema in MySQL
- Generate Prisma client types

**View/Edit database (optional):**
```bash
npm run prisma:studio
```

This opens Prisma Studio at `http://localhost:5555` to view and edit data.

### 4. Environment Configuration

Your `.env` is already configured for MySQL at `192.168.1.1:3307`:
```
DATABASE_URL="mysql://root:0202@192.168.1.1:3307/dastrevas"
```

For Google Calendar integration (optional), update:
```
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
```

For NextAuth, generate a secret:
```bash
# On Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | Cut-Object -Last 32

# Or use online generator: https://generate-secret.now.sh/
```

### 5. Start Development Server

```bash
npm run dev
```

Open browser: http://localhost:3000

## 📖 Development Workflow

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx
│   ├── page.tsx        # Main page
│   ├── globals.css
│   ├── api/
│   │   └── tasks/      # API routes
│   └── (future pages)
├── components/
│   ├── layout/         # Header, navigation
│   ├── calendar/       # Calendar components
│   ├── tasks/          # Task-related components
│   ├── command/        # Command palette
│   └── providers/      # Context providers
├── lib/
│   ├── priorityScheduling.ts  # Priority algorithm
│   ├── store.ts               # Zustand state
│   ├── dateUtils.ts
│   └── taskUtils.ts
└── prisma/
    └── schema.prisma   # Database schema
```

### Making Changes

1. **Edit components**: Files in `src/components/` are Hot Module Reloaded (HMR)
2. **Edit state**: Modify `src/lib/store.ts` for global state
3. **Database changes**: Modify `prisma/schema.prisma`, then run `npm run prisma:migrate`
4. **Add API routes**: Create files in `src/app/api/`

### Priority Scheduling Algorithm

The algorithm is in `src/lib/priorityScheduling.ts`:

```typescript
score = (urgency × 0.4) + (priority × 0.35) + (reminder × 0.15) + (duration × 0.1)
```

To adjust weights, edit the percentages in `calculateTaskScore()`.

### State Management with Zustand

Global state is in `src/lib/store.ts`. Example:

```typescript
import { useTaskStore } from '@/lib/store'

// In component:
const { tasks, addTask, updateTask } = useTaskStore()
```

## 🎯 Next Steps to Enhance

### Phase 1: Core Features (Current)
- ✅ Task CRUD
- ✅ Priority Scheduling
- ✅ Calendar view
- ✅ Command palette
- ✅ Dark/light mode

### Phase 2: Add These Features

1. **Database Integration**
   - Connect to MySQL using Prisma Client
   - Add API routes in `src/app/api/`
   - Update components to fetch from API

2. **Authentication**
   - Setup NextAuth.js in `src/app/api/auth/[...nextauth]`
   - Add login/signup pages
   - Protected routes

3. **Google Calendar Sync**
   - Install `googleapis` package (already in package.json)
   - Create sync service
   - Add OAuth flow

4. **Notifications**
   - Add reminder notifications
   - Email reminders
   - Desktop notifications (Web Push API)

### Phase 3: Advanced Features

- Analytics dashboard
- Team collaboration
- Recurring tasks
- Mobile app
- Progressive Web App (PWA)

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio

# Linting
npm run lint             # Run ESLint

# Environment
npm install              # Install dependencies
npm install <package>    # Add new package
```

## 🐛 Troubleshooting

### "Cannot find module 'zustand'"
```bash
npm install zustand
```

### Database connection error
- Check MySQL is running
- Verify credentials in `.env`
- Test connection: `npx prisma validate`

### Port 3000 already in use
```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

### Clear cache and reinstall
```bash
rm -r node_modules
rm package-lock.json
npm install
```

## 📚 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **React Hooks**: https://react.dev/reference/react
- **TailwindCSS**: https://tailwindcss.com/docs
- **Zustand**: https://zustand-demo.vercel.app/
- **Prisma**: https://www.prisma.io/docs/
- **TypeScript**: https://www.typescriptlang.org/docs/

## 💡 Tips

1. Use `Ctrl+K` (Cmd+K on Mac) to open command palette
2. Check browser console (F12) for errors
3. Use Prisma Studio (`npm run prisma:studio`) to inspect database
4. React DevTools extension helps debug component state
5. Start with MVP features before adding complexity

---

**Happy Coding! 🎉**
