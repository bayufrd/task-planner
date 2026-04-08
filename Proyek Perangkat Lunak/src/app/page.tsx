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

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { theme: currentTheme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const theme = currentTheme // Use actual theme from ThemeProvider instead of hardcoding

  // Fixed hero video
  const heroVideo = '71c87278-d28e-4933-bbba-25dccdca5117.mp4'
  
  // Sequential videos for sections after hero
  const sequentialVideos = [
    'motion_2.0_Indonesian_young_professional_working_at_desk_laptop_open_smartphone_beside_him_-0.mp4',
    'motion_2.0_Indonesian_young_woman_smiling_gently_while_looking_at_her_smartphone_with_sched-0.mp4',
    'veo-3.1-fast-generate-001_scene_1_title_POV_Opening_-_AI_Planner_Terminal_duration_4-5_seconds_camera_firs-0.mp4',
    'motion_2.0_Indonesian_young_adult_looking_calm_and_productive_holding_smartphone_while_view-0.mp4'
  ]

  let videoIndex = 0

  const getNextVideo = () => {
    const video = sequentialVideos[videoIndex % sequentialVideos.length]
    videoIndex++
    return video
  }

  const getRandomPosition = () => {
    const positions = ['left', 'right', 'center']
    return positions[Math.floor(Math.random() * positions.length)]
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleStartNow = async () => {
    setIsLoading(true)
    await signIn('google', { redirect: true, callbackUrl: '/dashboard' })
  }

  const features = [
    {
      icon: Brain,
      title: t('landing.casualLanguageTitle'),
      description: t('landing.casualLanguageDesc')
    },
    {
      icon: Zap,
      title: t('landing.hapticRemindersTitle'),
      description: t('landing.hapticRemindersDesc')
    },
    {
      icon: Watch,
      title: t('landing.worksWithCalendarTitle'),
      description: t('landing.worksWithCalendarDesc')
    }
  ]

  const phases = [
    {
      phase: t('landing.phaseNow'),
      icon: Sparkles,
      title: t('landing.aiTaskFoundationTitle'),
      features: typeof t('landing.aiTaskFoundationFeatures') === 'string' 
        ? ['AI-powered natural language parsing', 'Google Calendar native sync', 'Smart task organization']
        : t('landing.aiTaskFoundationFeatures') as string[]
    },
    {
      phase: t('landing.phaseNextMonth'),
      icon: Watch,
      title: t('landing.wearableHapticsTitle'),
      features: typeof t('landing.wearableHapticsFeatures') === 'string'
        ? ['Wearable device integration', 'Haptic reminder patterns', 'Smart escalating alerts', 'Device sync & management']
        : t('landing.wearableHapticsFeatures') as string[]
    },
    {
      phase: t('landing.phaseComingSummer'),
      icon: Brain,
      title: t('landing.aiIntelligenceTitle'),
      features: typeof t('landing.aiIntelligenceFeatures') === 'string'
        ? ['AI knowledge breakdown', 'Auto-recurring tasks', 'Intelligent scheduling', 'Team collaboration', 'Analytics dashboard']
        : t('landing.aiIntelligenceFeatures') as string[]
    }
  ]

  const topFeatures = [
    {
      number: '1',
      icon: Brain,
      title: t('landing.understandCasualTitle'),
      description: t('landing.understandCasualDesc'),
      impact: t('landing.understandCasualImpact')
    },
    {
      number: '2',
      icon: Zap,
      title: t('landing.smartRemindersTitle'),
      description: t('landing.smartRemindersDesc'),
      impact: t('landing.smartRemindersImpact')
    },
    {
      number: '3',
      icon: Watch,
      title: t('landing.syncCalendarTitle'),
      description: t('landing.syncCalendarDesc'),
      impact: t('landing.syncCalendarImpact')
    }
  ]

  return (
    <div className={`min-h-screen w-full transition-colors ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-300/20'}`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-300/20'}`}></div>
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-cyan-900/10' : 'bg-cyan-300/10'}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className={`border-b transition-colors ${theme === 'dark' ? 'border-gray-800/50 backdrop-blur-sm bg-gray-950/50' : 'border-white/20 dark:border-gray-800/50 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskPlanner
              </span>
            </div>
            
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
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    language === 'id'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  🇮🇩 ID
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
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
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
                  {mounted && language === 'id' ? 'Perencanaan Tugas Bertenaga AI' : 'AI-Powered Task Planning'}
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
                  <span className={`block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {mounted && language === 'id' ? 'Rencanakan Lebih Cerdas,' : 'Plan Smarter,'}
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    {mounted && language === 'id' ? 'Bekerja Lebih Baik' : 'Work Better'}
                  </span>
                </h1>
                <p className={`text-lg sm:text-xl max-w-2xl leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {mounted && language === 'id' 
                    ? 'Asisten perencanaan bertenaga AI yang memahami input bahasa kasual, disinkronkan dengan Google Calendar, dan mengirimkan pengingat haptic ke perangkat yang dapat dikenakan.'
                    : 'An AI-powered planning assistant that understands casual language, syncs with Google Calendar, and sends haptic reminders to your wearable devices.'
                  }
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleStartNow}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {mounted && language === 'id' ? 'Masuk...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      {mounted && language === 'id' ? 'Mulai Sekarang' : 'Start Now'}
                      <ArrowRight className="w-5 h-5" strokeWidth={2} />
                    </>
                  )}
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
                <source src="/vids/ac7d1492-c7ee-42d2-b937-fe801c4e48f6.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('landing.threeThingsTitle')}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('landing.threeThingsDesc')}
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
                <source src={`/vids/${getNextVideo()}`} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Top 3 Features Section */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {mounted && language === 'id' ? 'Top 3 MVP Features' : 'Top 3 MVP Features'}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {mounted && language === 'id' 
                ? 'Fitur ROI tertinggi yang tersedia sekarang'
                : 'The highest-impact features available right now'
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Video di kiri */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl shadow-blue-500/20 h-96 order-2 lg:order-1">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={`/vids/${getNextVideo()}`} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Features di kanan */}
            <div className="grid gap-8 order-1 lg:order-2">
              {topFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                <div
                  key={index}
                  className={`group relative rounded-2xl border transition-all duration-300 p-8 ${theme === 'dark' ? 'border-gray-800/50 bg-gray-900/80 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10' : 'border-gray-200/50 bg-white/80 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10'}`}
                >
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {feature.number}
                  </div>

                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                    <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  </div>

                  <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-4 h-4" />
                    {feature.impact}
                  </div>
                </div>
              )
              })}
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
                <source src={`/vids/${getNextVideo()}`} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* All 10 Features Section */}
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
              { icon: Vibrate, title: 'Wearable Haptic Alerts', status: 'Coming Soon', desc: 'Smart vibration patterns that escalate as your task approaches. Haptic feedback is proven to be 5x more effective than notifications at driving action.' },
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
              <source src="/vids/motion_2.0_Indonesian_young_adult_looking_calm_and_productive_holding_smartphone_while_view-0.mp4" type="video/mp4" />
            </video>
            {/* Blur Glass Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-3xl border border-gray-700/30 p-12 space-y-6 bg-gray-950/20 backdrop-blur-md">
              <h2 className="text-4xl sm:text-5xl font-bold text-white">
                {mounted && language === 'id' ? 'Siap Mengubah Produktivitas Anda?' : 'Ready to Transform Your Productivity?'}
              </h2>
              <p className="text-lg text-gray-200">
                {mounted && language === 'id' 
                  ? 'Bergabunglah dengan beta dan rasakan perencanaan bertenaga AI dengan integrasi wearable'
                  : 'Join the beta and experience AI-powered planning with wearable integration'
                }
              </p>
              <button
                onClick={handleStartNow}
                disabled={isLoading}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all duration-200 inline-flex items-center gap-2 shadow-2xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {mounted && language === 'id' ? 'Masuk...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {mounted && language === 'id' ? 'Mulai Sekarang' : 'Start Now'}
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`border-t transition-colors backdrop-blur-sm py-8 ${theme === 'dark' ? 'border-gray-800/50 bg-gray-950/50' : 'border-gray-200/50 bg-white/50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2026 TaskPlanner. {mounted && language === 'id' ? 'Perencanaan Tugas Bertenaga AI.' : 'AI-Powered Task Planning.'}
              </p>
              <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{mounted && language === 'id' ? 'Privasi' : 'Privacy'}</a>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{mounted && language === 'id' ? 'Persyaratan' : 'Terms'}</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
