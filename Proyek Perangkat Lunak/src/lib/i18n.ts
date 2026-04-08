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
