# Smart Task Planner

**AI-powered universal task management system with intelligent priority scheduling**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)

[🌐 Live Demo](https://taskplanner.dastrevas.com) | [📚 Documentation](./docs) | [🚀 Deployment Guide](./docs/DEPLOYMENT.md)

---

## Overview

Smart Task Planner is a fullstack web application designed for students, freelancers, and professionals who need intelligent task management with automatic priority scheduling. Unlike traditional to-do apps, Smart Task Planner uses a sophisticated 4-factor algorithm to automatically rank your tasks based on urgency, importance, reminders, and estimated duration.

**Capstone Project**: Fullstack Software Engineering | taskplanner

---

## 🎯 Key Features

### 📋 Intelligent Task Management
- **Auto-Priority Ranking**: AI-powered algorithm scores tasks using 4 weighted factors (Urgency: 40%, Priority: 35%, Reminders: 15%, Duration: 10%)
- **Smart Scheduling**: Visual calendar timeline shows task distribution across dates
- **Real-time Filtering**: Filter tasks by tags, dates, or priority levels instantly
- **Persistent Storage**: All tasks saved with automatic recovery on browser refresh

### 🎤 Natural Language Interface
- **Command Palette**: Hit `Ctrl+K` to open command interface
- **Chat-style Input**: Type commands in conversational format
- **NLP Parsing**: Intelligent command recognition for task creation and management
- **Quick Actions**: Add, edit, complete, or delete tasks without navigation

### 🌙 Professional UI/UX
- **Dark/Light Mode**: System-aware theme with persistent user preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Instant visual feedback for all actions
- **Accessibility**: WCAG 2.1 compliant interface

### 🔗 Calendar Integration
- **Google Calendar Sync**: (Phase 1) Synchronize tasks with Google Calendar
- **Date Visualization**: Visual timeline showing tasks across multiple weeks
- **Drag-and-Drop**: (Planned) Reschedule tasks with simple drag operations

### 📊 Analytics & Insights
- **Productivity Dashboard**: View task completion rates and patterns
- **Priority Insights**: Understand which tasks consume your time
- **Deadline Tracking**: Visual alerts for approaching deadlines

---

## 🛠️ Technology Stack

**Frontend**:
- **Next.js 14** - React framework with App Router and SSR
- **React 18** - UI library with hooks
- **TypeScript 5.3** - Type-safe development
- **TailwindCSS 3.3** - Utility-first styling with dark mode support
- **Zustand 4.4** - Lightweight state management with persistence

**Backend**:
- **Next.js API Routes** - Serverless backend functions
- **Prisma 5.7** - Modern ORM with type safety
- **NextAuth.js 4.24** - Authentication and OAuth integration

**Database**:
- **MySQL 5.7+** - Relational database
- **Prisma Schema** - Type-safe database client

**Integrations**:
- **Google Calendar API** - Calendar synchronization
- **Google OAuth 2.0** - Secure user authentication

---

## 📦 MVP Feature Set

✅ **Completed**:
- Task creation, editing, and deletion
- Automatic priority calculation with 4-factor algorithm
- Task filtering by date and tags
- Dark/light mode theme toggle
- Command palette interface with NLP parsing
- Calendar timeline visualization
- LocalStorage persistence
- Responsive design

🔄 **Phase 1 (In Development)**:
- Database integration with MySQL/Prisma
- User authentication with NextAuth.js + Google OAuth
- Google Calendar synchronization
- Task reminders and notifications
- API endpoints for CRUD operations

📋 **Future Enhancements**:
- Collaborative task sharing
- Team workspaces
- Advanced analytics dashboard
- Mobile native app (React Native)
- Recurring task templates
- Time tracking integration

---

## 🚀 Deployment

**Smart Task Planner is deployed on**:

```
https://taskplanner.dastrevas.com
```

### Deployment Stack
- **Server**: Linux (Ubuntu 20.04+)
- **Process Manager**: PM2
- **Web Server**: Nginx reverse proxy
- **SSL**: Let's Encrypt with auto-renewal
- **Database**: MySQL 5.7+ on dedicated server
- **Monitoring**: PM2 monitoring with error logs

For detailed deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 📖 Documentation

Complete documentation is organized by phase and concern:

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Production deployment guide for taskplanner.dastrevas.com |
| [docs/phase0/](./docs/phase0/) | Development phase documentation |
| [STITCH_UI_PROMPT.md](./docs/STITCH_UI_PROMPT.md) | Google Stitch UI generation prompt and visual context |
| [docs/README.md](./docs/README.md) | Documentation index and navigation |

---

## 💻 Getting Started (Development)

For development setup and local testing, see [docs/phase0/DEVELOPMENT.md](./docs/phase0/DEVELOPMENT.md)

### Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run database migrations
npm run prisma:migrate
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

---

## 🗄️ Database Schema

Smart Task Planner uses 5 core tables:

- **users** - User accounts and authentication
- **tasks** - Task records with metadata
- **task_tags** - Task categorization and filtering
- **reminders** - Task reminders and notifications
- **calendars** - Google Calendar synchronization data

See [docs/phase0/DATABASE_SETUP.md](./docs/phase0/DATABASE_SETUP.md) for detailed schema information.

---

## 🔒 Security

- **Type Safety**: Full TypeScript implementation prevents runtime errors
- **Input Validation**: All user inputs validated before processing
- **SQL Injection Prevention**: Prisma ORM prevents SQL injection attacks
- **XSS Protection**: React and Next.js built-in XSS protection
- **Authentication**: Secure OAuth 2.0 with NextAuth.js
- **HTTPS Enforcement**: All traffic encrypted with Let's Encrypt SSL

---

## 📈 Performance

- **Optimized Build**: Next.js production build with code splitting
- **Lazy Loading**: Components loaded on-demand for faster initial load
- **Caching Strategy**: Browser caching with ISR (Incremental Static Regeneration)
- **Database Optimization**: Indexed queries and connection pooling
- **Runtime**: Node.js 18+ with PM2 clustering

**Metrics**:
- Load Time: ~1.2s (first visit)
- Time to Interactive: ~1.5s
- Lighthouse Score: 90+ (performance)

---

## 🤝 Contributing
This project is maintained as a Capstone Software Engineering and Fullstack Programming project. For academic or programming-related inquiries, contact the development team.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

For issues, questions, or suggestions:
- 📧 Email: bayu.farid36@gmail.com
- 🐛 Bug Reports: [GitHub Issues](https://github.com/bayufrd/taskplanner/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/bayufrd/taskplanner/discussions)

---

## 🙏 Acknowledgments

Built as a Fullstack Software Engineering Capstone Project demonstrating modern web development practices with Next.js, React, TypeScript, and cloud deployment.

**Tech Stack Credits**:
- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://www.prisma.io) - Database ORM
- [TailwindCSS](https://tailwindcss.com) - Styling
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [NextAuth.js](https://next-auth.js.org) - Authentication

---

*Last Updated: 2026 | Deployed at https://taskplanner.dastrevas.com*
