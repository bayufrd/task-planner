'use client'

import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  ArrowRight, 
  Zap, 
  Brain, 
  Watch, 
  BarChart3, 
  Users, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Moon,
  Sun,
  MessageSquare,
  Vibrate,
  Calendar,
  Lightbulb,
  Clock,
  Wand2,
  RotateCcw,
  TrendingUp,
  Users2
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'

// Static video paths
const VIDEOS = {
  hero: '/vids/ac7d1492-c7ee-42d2-b937-fe801c4e48f6.mp4',
  features1: '/vids/motion_2.0_Indonesian_young_professional_working_at_desk_laptop_open_smartphone_beside_him_-0.mp4',
  features2: '/vids/motion_2.0_Indonesian_young_woman_smiling_gently_while_looking_at_her_smartphone_with_sched-0.mp4',
  timeline: '/vids/veo-3.1-fast-generate-001_scene_1_title_POV_Opening_-_AI_Planner_Terminal_duration_4-5_seconds_camera_firs-0.mp4',
  cta: '/vids/motion_2.0_Indonesian_young_adult_looking_calm_and_productive_holding_smartphone_while_view-0.mp4'
}

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme: currentTheme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const theme = currentTheme

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleStartNow = async () => {
    router.push('/auth/signin?callbackUrl=%2Fdashboard')
  }

  const features = [
    {



      icon: BarChart3,
      title: mounted && language === 'id' ? 'Peringkat Prioritas AI' : 'AI-Priority Ranking',
      description: mounted && language === 'id'
        ? 'AI mengurutkan tugas berdasarkan urgensi, prioritas, pengingat, dan durasi agar Anda tahu apa yang harus dikerjakan berikutnya.'
        : 'AI ranks tasks based on urgency, priority, reminders, and duration so you always know what to do next.'
    },
    {



      icon: Calendar,
      title: mounted && language === 'id' ? 'Sinkronisasi Google Calendar' : 'Google Calendar Sync',
      description: mounted && language === 'id'
        ? 'Sinkronkan tugas dengan Google Calendar agar jadwal Anda tetap rapi dan mudah dipantau.'
        : 'Sync tasks with Google Calendar so your schedule stays organized and easy to follow.'
    },
    {



      icon: MessageSquare,
      title: mounted && language === 'id' ? 'Perintah Bahasa Natural' : 'Natural Language Commands',
      description: mounted && language === 'id'
        ? 'Ketik tugas seperti berbicara, lalu AI mengubahnya menjadi tugas terstruktur secara instan.'
        : 'Type tasks just like you talk, then AI turns them into structured tasks instantly.'
    }
  ]

  const phases = [
    {
      phase: mounted && language === 'id' ? 'Sekarang' : 'Now',
      icon: Sparkles,
      title: mounted && language === 'id' ? 'Fondasi Tugas AI' : 'AI Task Foundation',
      features: [
        mounted && language === 'id' ? 'Parsing bahasa natural bertenaga AI' : 'AI-powered natural language parsing',
        mounted && language === 'id' ? 'Sinkronisasi native Google Calendar' : 'Google Calendar native sync',
        mounted && language === 'id' ? 'Organisasi tugas cerdas' : 'Smart task organization'
      ]
    },
    {
      phase: mounted && language === 'id' ? 'Segera Hadir' : 'Coming Soon',
      icon: Brain,
      title: mounted && language === 'id' ? 'Kecerdasan AI' : 'AI Intelligence',
      features: [
        mounted && language === 'id' ? 'Pemecahan pengetahuan AI' : 'AI knowledge breakdown',
        mounted && language === 'id' ? 'Tugas berulang otomatis' : 'Auto-recurring tasks',
        mounted && language === 'id' ? 'Penjadwalan cerdas' : 'Intelligent scheduling',
        mounted && language === 'id' ? 'Kolaborasi tim' : 'Team collaboration',
        mounted && language === 'id' ? 'Dashboard analitik' : 'Analytics dashboard'
      ]
    }
  ]

  

  return (
    <div className={`min-h-screen w-full transition-colors ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
      {/* Decorative Background - Only render after mount untuk avoid CLS */}
      {mounted && (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-300/20'}`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-300/20'}`}></div>
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-cyan-900/10' : 'bg-cyan-300/10'}`}></div>
      </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
          <nav className={`border-b transition-colors ${theme === 'dark' ? 'border-gray-800/50 backdrop-blur-sm bg-gray-950/50' : 'border-white/20 dark:border-gray-800/50 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2">
                <img src="/logo3.webp" alt="TaskPlanner" className="h-10 w-auto" />
              </a>
            
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-gray-900/50 rounded-lg p-1 border border-gray-200/50 dark:border-gray-800/50">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    language === 'en'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    language === 'id'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  ID
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-gray-100/50 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" strokeWidth={2} />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" strokeWidth={2} />
                )}
              </button>

              {/* Sign In Button */}
              <button
                onClick={handleStartNow}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800/50' : 'bg-blue-100/50 border-blue-200/50'}`}>
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {mounted && language === 'id' ? 'Asisten AI & Integrasi WhatsApp sudah aktif' : 'AI Assistant & WhatsApp Integration is now live'}
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
                  <span className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {mounted && language === 'id' ? 'Rencanakan lebih cerdas.' : 'Plan smarter.'}
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    {mounted && language === 'id' ? 'Selesaikan lebih cepat.' : 'Finish faster.'}
                  </span>
                </h1>
                <p className={`text-lg sm:text-xl max-w-2xl leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {mounted && language === 'id' 
                    ? 'Tugas yang diperingkat AI berdasarkan urgensi, prioritas, pengingat, dan durasi. Dapatkan kembali fokus Anda dan hilangkan kebingungan memilih pekerjaan berikutnya dengan mesin tugas cerdas pribadi.'
                    : 'AI-ranked tasks based on urgency, priority, reminders, and duration. Regain focus and eliminate decision fatigue with your own intelligent task engine.'
                  }
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleStartNow}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
                >
                  {mounted && language === 'id' ? 'Mulai Sekarang' : 'Start Now'}
                  <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Trust Badge */}
              <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                Google Calendar integration • Multi-language support • Secure OAuth
              </div>
            </div>

            {/* Video */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl shadow-blue-500/20 h-96 lg:h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover object-left-center rounded-2xl"
                style={{ objectPosition: '2px center' }}
              >
                <source src={VIDEOS.hero} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {mounted && language === 'id' ? 'Dibangun untuk kejelasan' : 'Built for clarity'}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {mounted && language === 'id' ? 'AI kami menangani logistik sehingga Anda dapat fokus pada pekerjaan yang benar-benar penting.' : 'Our AI handles the logistics so you can focus on the work that actually matters.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className={`group p-6 rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'border-gray-800/50 bg-gray-900/50 hover:bg-gray-800/80 hover:border-blue-400/50' : 'border-gray-200/50 bg-white/50 hover:bg-white/80 hover:border-blue-400/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 ${theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Video */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl shadow-blue-500/20 h-96">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={VIDEOS.features1} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA Section */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-white font-semibold text-xs uppercase tracking-widest mb-8">
              {mounted && language === 'id' ? 'Penawaran Terbaik' : 'Best Deal'}
            </div>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {mounted && language === 'id' ? 'Hack Produktivitas Terbaik: Task Planner Anda, sekarang di WhatsApp.' : 'The Ultimate Productivity Hack: Your Task Planner, now on WhatsApp.'}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {mounted && language === 'id' 
                ? 'Selesaikan pekerjaan di tempat Anda sudah menghabiskan waktu. Tidak perlu aplikasi baru, hanya asisten AI pribadi Anda di aplikasi chat favorit.'
                : 'Get things done where you already spend your time. No new apps to download, just your personal AI assistant in your favorite chat app.'
              }
            </p>
            <button
              onClick={handleStartNow}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-2xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
            >
              {mounted && language === 'id' ? 'Hubungkan WhatsApp Sekarang' : 'Connect WhatsApp Now'}
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl shadow-blue-500/20 h-96 max-w-4xl mx-auto">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={VIDEOS.features2} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className={`text-5xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>98%</div>
              <div className={`text-xs font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {mounted && language === 'id' ? 'Tingkat Penyelesaian Tugas' : 'Task Completion Rate'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold tracking-tighter text-blue-600">2hr+</div>
              <div className={`text-xs font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {mounted && language === 'id' ? 'Waktu Harian Dihemat' : 'Daily Time Saved'}
              </div>
            </div>
            <div className="space-y-2">
              <div className={`text-5xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>50k+</div>
              <div className={`text-xs font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {mounted && language === 'id' ? 'Profesional Aktif' : 'Active Professionals'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold tracking-tighter text-indigo-600">4.9<span className="text-2xl">/5</span></div>
              <div className={`text-xs font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {mounted && language === 'id' ? 'Kepuasan Pengguna' : 'User Satisfaction'}
              </div>
            </div>
          </div>
        </div>

        {/* Rollout Timeline Section */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Our Rollout Timeline
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Built with you in mind. Features roll out based on user feedback and real-world testing
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Timeline di kiri */}
            <div className="grid md:grid-cols-1 gap-8">
              {phases.map((item, index) => {
                const Icon = item.icon
                return (
                <div
                  key={index}
                  className={`relative rounded-2xl border transition-all duration-300 p-8 ${theme === 'dark' ? 'border-gray-800/50 bg-gray-900/50 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10' : 'border-gray-200/50 bg-white/50 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10'}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                      {item.phase}
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <ul className="space-y-3">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className={`flex items-start gap-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
              })}
            </div>

            {/* Video di kanan */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl shadow-blue-500/20 h-96 lg:h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={VIDEOS.timeline} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Features Bento Grid Section */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              The Complete Planning System
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to master your schedule, from AI-powered task creation to intelligent reminders and beyond
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageSquare, title: 'AI Understands Your Language', status: 'Available Now', desc: 'Type naturally in any language. Our AI parses casual speech, abbreviations, and mixed languages instantly. No rigid forms, no perfect syntax required.' },
              
              { icon: Calendar, title: 'Google Calendar Native', status: 'Available Now', desc: 'Create, edit, and sync tasks directly with Google Calendar. Your tasks live where you already look—no switching between apps.' },
              { icon: Lightbulb, title: 'AI Knowledge Breakdown', status: 'Coming Soon', desc: 'Tell our AI what you want to learn or achieve. It automatically breaks complex projects into manageable daily tasks with realistic timelines.' },
              { icon: Clock, title: 'Intelligent Scheduling', status: 'Coming Soon', desc: 'Never double-book again. Our AI detects conflicts, suggests optimal times, and prevents burnout with smart work distribution.' },
              { icon: Wand2, title: 'Smart Suggestions', status: 'Coming Soon', desc: 'As you use TaskPlanner, it learns your work patterns and proactively suggests optimizations to your schedule.' },
              { icon: RotateCcw, title: 'Auto-Recurring Tasks', status: 'Coming Soon', desc: 'The AI recognizes patterns and automatically creates recurring tasks with the right frequency—daily, weekly, or custom intervals.' },
              { icon: TrendingUp, title: 'Task Analytics', status: 'Coming Soon', desc: 'Beautiful dashboards show your productivity patterns, completion rates, and insights to help you work smarter.' },
              { icon: Users2, title: 'Team Collaboration', status: 'Coming Soon', desc: 'Share workspaces with your team. Assign tasks, track progress together, and keep everyone aligned on what matters.' }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
              <div key={index} className={`rounded-2xl border transition-all duration-300 p-6 hover:shadow-lg ${theme === 'dark' ? 'border-gray-800/50 bg-gray-900/50 hover:border-blue-400/50' : 'border-gray-200/50 bg-white/50 hover:border-blue-400/50'}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h4>
                    <p className={`text-xs font-semibold mt-1 ${feature.status === 'Available Now' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {feature.status}
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feature.desc}</p>
              </div>
            )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-20 overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={VIDEOS.cta} type="video/mp4" />
            </video>
            {/* Blur Glass Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-3xl border border-gray-700/30 p-12 space-y-6 bg-gray-950/20 backdrop-blur-md">
              <h2 className="text-4xl sm:text-5xl font-bold text-white">
                {mounted && language === 'id' ? 'Berhenti mengelola, mulai bekerja.' : 'Stop managing, start doing.'}
              </h2>
              <p className="text-lg text-gray-200">
                {mounted && language === 'id' 
                  ? 'Bergabunglah dengan ribuan profesional yang telah menguasai jadwal mereka dengan Smart Task Planner.'
                  : 'Join thousands of professionals who have mastered their schedule with Smart Task Planner.'
                }
              </p>
              <button
                onClick={handleStartNow}
                className="px-10 py-5 bg-blue-600 hover:bg-white hover:text-gray-900 text-white rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center gap-2 shadow-2xl"
              >
                {mounted && language === 'id' ? 'Mulai Gratis' : 'Get Started for Free'}
              </button>
              <p className="text-white/40 font-semibold uppercase tracking-widest text-xs">
                {mounted && language === 'id' ? 'Tidak perlu kartu kredit • Uji coba gratis 14 hari' : 'No credit card required • Free 14-day trial'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`border-t transition-colors backdrop-blur-sm py-8 ${theme === 'dark' ? 'border-gray-800/50 bg-gray-950/50' : 'border-gray-200/50 bg-white/50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2024 Smart Task Planner. {mounted && language === 'id' ? 'Semua hak dilindungi.' : 'All rights reserved.'}
              </p>
              <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{mounted && language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}</a>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{mounted && language === 'id' ? 'Ketentuan Layanan' : 'Terms of Service'}</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
