// Language translations for Smart Task Planner
// Supported: en (English), id (Indonesia)

export type Language = 'en' | 'id'

export const translations = {
  en: {
    // Header
    header: {
      title: 'Task Planner',
      command: 'Command',
      toggleTheme: 'Toggle theme',
      toggleLanguage: 'Toggle language',
      menu: 'Menu',
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      settings: 'Settings',
      language: 'Language',
      english: 'English',
      indonesia: 'Indonesia',
    },
    // Command Palette
    command: {
      title: 'Command Palette',
      placeholder: "Type task: 'add meeting tomorrow 3pm high' or /add...",
      execute: 'Execute',
      close: 'Close (Esc)',
      recentCommands: 'Recent Commands',
      navigateHistory: '↑↓ to navigate',
      naturalLanguage: 'Natural Language',
      slashCommands: 'Slash Commands',
      addTask: 'add task',
      listTasks: 'all tasks',
      todayTasks: "today's tasks",
      unknownCommand: '❌ Unknown command. Try /help',
      commandHelp: 'Commands: /add, /list, /today',
    },
    // Task List
    taskList: {
      today: 'Today',
      upcoming: 'Upcoming',
      all: 'All',
      noTasks: 'No tasks in this view',
    },
    // Empty State
    emptyState: {
      title: 'No tasks yet',
      description: 'Create your first task using the command palette or the button in the header',
      addTask: 'Add Task',
    },
    // Calendar
    calendar: {
      today: 'Today',
      tasksToday: 'Tasks today',
      month: 'Month',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
    },
    // Task Card
    task: {
      status: {
        todo: 'To Do',
        inProgress: 'In Progress',
        done: 'Done',
      },
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
      deadline: 'Deadline',
      daysRemaining: 'day remaining',
      daysRemainingPlural: 'days remaining',
      estimatedDuration: 'Duration',
      reminder: 'Reminder',
      minutesBefore: 'min before',
      tags: 'Tags',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      markDone: 'Mark as Done',
    },
    // Notifications
    notifications: {
      taskAdded: 'Task added',
      taskUpdated: 'Task updated',
      taskDeleted: 'Task deleted',
      taskCompleted: 'Task completed',
    },
    // Status messages
    status: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      nextWeek: 'Next week',
    },
    // Landing Page
    landing: {
      aiPowerTaskPlanning: 'AI-Powered Task Planning',
      planSmarter: 'Plan Smarter,',
      workBetter: 'Work Better',
      description: 'An AI-powered planning assistant that understands casual language, syncs with Google Calendar, and sends haptic reminders to your wearable devices.',
      startNow: 'Start Now',
      signingIn: 'Signing in...',
      trustBadge: 'Google Calendar integration • Multi-language support • Secure OAuth',
      whyChoose: 'Why Choose TaskPlanner?',
      whyChooseDesc: 'The only planning tool built with AI + Wearables + Casual Language',
      topFeatures: 'Top 3 MVP Features',
      topFeaturesDesc: 'Highest ROI features launching in Phase 1',
      feature1Title: 'Smart Task Automation',
      feature1Desc: 'AI learns your patterns and auto-creates recurring tasks with 95% accuracy',
      feature1Impact: '70% reduction in manual creation',
      feature2Title: 'AI Task Assistant',
      feature2Desc: 'Chat-like interface for planning help and task optimization',
      feature2Impact: '40% better time allocation',
      feature3Title: 'Time Blocking & Focus',
      feature3Desc: 'Deep work sessions with intelligent conflict detection',
      feature3Impact: '40% productivity boost',
      phases: 'Development Phases',
      phasesDesc: 'From MVP to complete productivity OS',
      phaseMVPLaunch: 'MVP Launch',
      phaseFirstMonth: 'First Month',
      phaseGrowth: 'Growth',
      allFeatures: '10 Powerful All-In-One Features',
      allFeaturesDesc: 'Complete productivity operating system launching in phases',
      ctaTitle: 'Ready to Transform Your Productivity?',
      ctaDesc: 'Join the beta and experience AI-powered planning with wearable integration',
      // Core Features Section (Three Things Google Calendar Can't Do)
      threeThingsTitle: 'The Three Things Google Calendar Can\'t Do',
      threeThingsDesc: 'We enhance Google Calendar with the AI intelligence, wearable integration, and casual language support your calendar deserves',
      casualLanguageTitle: 'Casual Language, Any Language',
      casualLanguageDesc: 'Just speak your task naturally. Our AI parses abbreviations, mixed languages, and casual speech instantly. No perfect syntax required—we understand how humans actually talk.',
      hapticRemindersTitle: 'Haptic Reminders That Work',
      hapticRemindersDesc: 'Vibration patterns are 5x more effective than notifications at driving action. Your wearable escalates alerts as your task approaches. You will never miss what matters.',
      worksWithCalendarTitle: 'Works With Your Calendar',
      worksWithCalendarDesc: 'Your tasks sync directly with Google Calendar. No switching apps, no duplicate entries. We enhance your calendar, not replace it.',
      // Phases Section
      phaseNow: 'Now',
      phaseNextMonth: 'Next Month',
      phaseComingSummer: 'Coming This Summer',
      aiTaskFoundationTitle: 'AI Task Foundation',
      aiTaskFoundationFeatures: ['AI-powered natural language parsing', 'Google Calendar native sync', 'Smart task organization'],
      wearableHapticsTitle: 'Wearable & Haptics',
      wearableHapticsFeatures: ['Wearable device integration', 'Haptic reminder patterns', 'Smart escalating alerts', 'Device sync & management'],
      aiIntelligenceTitle: 'AI Intelligence Layer',
      aiIntelligenceFeatures: ['AI knowledge breakdown', 'Auto-recurring tasks', 'Intelligent scheduling', 'Team collaboration', 'Analytics dashboard'],
      // Top Features
      understandCasualTitle: 'Understand Casual Language, Instantly',
      understandCasualDesc: 'No need to type perfectly. Just speak naturally—"tomorrow 3pm meeting with john, kinda important"—and our AI understands it all. Works in any language, any dialect, any level of formality.',
      understandCasualImpact: '80% Less Friction',
      smartRemindersTitle: 'Smart Reminders That Actually Work',
      smartRemindersDesc: 'Push notifications are easy to ignore. We send haptic patterns to your wearable—vibration escalates as your task approaches. Pattern-based reminders that train your brain to remember.',
      smartRemindersImpact: '5x Better Compliance',
      syncCalendarTitle: 'Sync With Your Existing Calendar',
      syncCalendarDesc: 'Tasks go straight to Google Calendar. No app switching, no duplicate entries. Everything stays in sync, but we add the AI intelligence Google Calendar should have.',
      syncCalendarImpact: 'Single Source of Truth',
      footer: '© 2026 TaskPlanner. AI-Powered Task Planning.',
    },
  },
  id: {
    // Header
    header: {
      title: 'Perencana Tugas',
      command: 'Perintah',
      toggleTheme: 'Ganti tema',
      toggleLanguage: 'Ganti bahasa',
      menu: 'Menu',
      dashboard: 'Dasbor',
      calendar: 'Kalender',
      settings: 'Pengaturan',
      language: 'Bahasa',
      english: 'Inggris',
      indonesia: 'Indonesia',
    },
    // Command Palette
    command: {
      title: 'Palet Perintah',
      placeholder: "Ketik tugas: 'add meeting besok 3pm high' atau /add...",
      execute: 'Jalankan',
      close: 'Tutup (Esc)',
      recentCommands: 'Perintah Terbaru',
      navigateHistory: '↑↓ untuk navigasi',
      naturalLanguage: 'Bahasa Alami',
      slashCommands: 'Perintah Garis Miring',
      addTask: 'tambah tugas',
      listTasks: 'semua tugas',
      todayTasks: 'tugas hari ini',
      unknownCommand: '❌ Perintah tidak dikenal. Coba /help',
      commandHelp: 'Perintah: /add, /list, /today',
    },
    // Task List
    taskList: {
      today: 'Hari Ini',
      upcoming: 'Mendatang',
      all: 'Semua',
      noTasks: 'Tidak ada tugas dalam tampilan ini',
    },
    // Empty State
    emptyState: {
      title: 'Belum ada tugas',
      description: 'Buat tugas pertama Anda menggunakan palet perintah atau tombol di header',
      addTask: 'Tambah Tugas',
    },
    // Calendar
    calendar: {
      today: 'Hari Ini',
      tasksToday: 'Tugas hari ini',
      month: 'Bulan',
      previousMonth: 'Bulan sebelumnya',
      nextMonth: 'Bulan berikutnya',
    },
    // Task Card
    task: {
      status: {
        todo: 'Akan Dilakukan',
        inProgress: 'Sedang Dikerjakan',
        done: 'Selesai',
      },
      priority: {
        high: 'Tinggi',
        medium: 'Sedang',
        low: 'Rendah',
      },
      deadline: 'Tenggat Waktu',
      daysRemaining: 'hari tersisa',
      daysRemainingPlural: 'hari tersisa',
      estimatedDuration: 'Durasi',
      reminder: 'Pengingat',
      minutesBefore: 'menit sebelumnya',
      tags: 'Tag',
      actions: 'Tindakan',
      edit: 'Ubah',
      delete: 'Hapus',
      markDone: 'Tandai Selesai',
    },
    // Notifications
    notifications: {
      taskAdded: 'Tugas ditambahkan',
      taskUpdated: 'Tugas diperbarui',
      taskDeleted: 'Tugas dihapus',
      taskCompleted: 'Tugas diselesaikan',
    },
    // Status messages
    status: {
      today: 'Hari ini',
      tomorrow: 'Besok',
      nextWeek: 'Minggu depan',
    },
    // Landing Page
    landing: {
      aiPowerTaskPlanning: 'Perencanaan Tugas Bertenaga AI',
      planSmarter: 'Rencanakan Lebih Cerdas,',
      workBetter: 'Bekerja Lebih Baik',
      description: 'Asisten perencanaan bertenaga AI yang memahami bahasa kasual, tersinkronisasi dengan Google Calendar, dan mengirim pengingat haptic ke perangkat wearable Anda.',
      startNow: 'Mulai Sekarang',
      signingIn: 'Sedang masuk...',
      trustBadge: 'Integrasi Google Calendar • Dukungan multi-bahasa • OAuth aman',
      whyChoose: 'Mengapa Memilih TaskPlanner?',
      whyChooseDesc: 'Satu-satunya alat perencanaan yang dibangun dengan AI + Wearable + Bahasa Kasual',
      topFeatures: 'Fitur MVP Top 3',
      topFeaturesDesc: 'Fitur ROI tertinggi diluncurkan di Phase 1',
      feature1Title: 'Otomasi Tugas Cerdas',
      feature1Desc: 'AI mempelajari pola Anda dan secara otomatis membuat tugas berulang dengan akurasi 95%',
      feature1Impact: 'Pengurangan 70% dalam pembuatan manual',
      feature2Title: 'Asisten Tugas AI',
      feature2Desc: 'Antarmuka seperti chat untuk bantuan perencanaan dan optimasi tugas',
      feature2Impact: 'Alokasi waktu 40% lebih baik',
      feature3Title: 'Time Blocking & Fokus',
      feature3Desc: 'Sesi kerja dalam dengan deteksi konflik yang cerdas',
      feature3Impact: 'Peningkatan produktivitas 40%',
      phases: 'Fase Pengembangan',
      phasesDesc: 'Dari MVP hingga OS produktivitas lengkap',
      phaseMVPLaunch: 'Peluncuran MVP',
      phaseFirstMonth: 'Bulan Pertama',
      phaseGrowth: 'Pertumbuhan',
      allFeatures: '10 Fitur All-In-One yang Ampuh',
      allFeaturesDesc: 'Sistem operasi produktivitas lengkap diluncurkan dalam fase',
      ctaTitle: 'Siap Mengubah Produktivitas Anda?',
      ctaDesc: 'Bergabunglah dengan beta dan rasakan perencanaan bertenaga AI dengan integrasi wearable',
      // Core Features Section (Three Things Google Calendar Can't Do)
      threeThingsTitle: 'Tiga Hal yang Google Calendar Tidak Bisa Lakukan',
      threeThingsDesc: 'Kami meningkatkan Google Calendar dengan kecerdasan AI, integrasi wearable, dan dukungan bahasa kasual yang layak diterima kalender Anda',
      casualLanguageTitle: 'Bahasa Kasual, Bahasa Apa Saja',
      casualLanguageDesc: 'Cukup ucapkan tugas Anda secara alami. AI kami mengurai singkatan, bahasa campuran, dan ucapan kasual secara instan. Tidak ada sintaks yang sempurna—kami memahami cara manusia berbicara.',
      hapticRemindersTitle: 'Pengingat Haptic yang Bekerja',
      hapticRemindersDesc: 'Pola getaran 5x lebih efektif daripada notifikasi dalam mendorong tindakan. Wearable Anda meningkatkan pemberitahuan saat tugas Anda mendekati. Anda tidak akan pernah melewatkan apa yang penting.',
      worksWithCalendarTitle: 'Bekerja Dengan Kalender Anda',
      worksWithCalendarDesc: 'Tugas Anda tersinkronisasi langsung dengan Google Calendar. Tanpa beralih aplikasi, tanpa entri duplikat. Kami meningkatkan kalender Anda, bukan menggantinya.',
      // Phases Section
      phaseNow: 'Sekarang',
      phaseNextMonth: 'Bulan Depan',
      phaseComingSummer: 'Datang Musim Panas Ini',
      aiTaskFoundationTitle: 'Fondasi Tugas AI',
      aiTaskFoundationFeatures: ['Penguraian bahasa alami bertenaga AI', 'Sinkronisasi asli Google Calendar', 'Organisasi tugas cerdas'],
      wearableHapticsTitle: 'Wearable & Haptics',
      wearableHapticsFeatures: ['Integrasi perangkat wearable', 'Pola pengingat haptic', 'Pemberitahuan yang meningkat dengan cerdas', 'Sinkronisasi & manajemen perangkat'],
      aiIntelligenceTitle: 'Lapisan Kecerdasan AI',
      aiIntelligenceFeatures: ['Pemecahan pengetahuan AI', 'Tugas berulang otomatis', 'Penjadwalan cerdas', 'Kolaborasi tim', 'Dashboard analitik'],
      // Top Features
      understandCasualTitle: 'Pahami Bahasa Kasual, Secara Instan',
      understandCasualDesc: 'Tidak perlu mengetik dengan sempurna. Cukup berbicara secara alami—"besok 3 sore rapat dengan john, agak penting"—dan AI kami memahami semuanya. Bekerja dalam bahasa apa pun, dialek apa pun, tingkat formalitas apa pun.',
      understandCasualImpact: 'Pengurangan Gesekan 80%',
      smartRemindersTitle: 'Pengingat Cerdas Yang Benar-Benar Berfungsi',
      smartRemindersDesc: 'Notifikasi push mudah diabaikan. Kami mengirim pola haptic ke wearable Anda—getaran meningkat saat tugas Anda mendekati. Pengingat berbasis pola yang melatih otak Anda untuk mengingat.',
      smartRemindersImpact: '5x Kepatuhan Lebih Baik',
      syncCalendarTitle: 'Sinkronisasi Dengan Kalender Anda yang Sudah Ada',
      syncCalendarDesc: 'Tugas masuk langsung ke Google Calendar. Tanpa beralih aplikasi, tanpa entri duplikat. Semuanya tetap tersinkronisasi, tetapi kami menambahkan kecerdasan AI yang seharusnya dimiliki Google Calendar.',
      syncCalendarImpact: 'Satu Sumber Kebenaran',
      footer: '© 2026 TaskPlanner. Perencanaan Tugas Bertenaga AI.',
    },
  },
}

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}
