'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Sparkles,
  Bot,
  MessageCircle,
  CalendarDays,
  Users,
  Play,
  CalendarSync,
  BarChart3,
  Globe
} from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'

// Video content mapping
const videos = {
  id: [
    '/vids/motion_2.0_Indonesian_young_adult_looking_calm_and_productive_holding_smartphone_while_view-0.mp4',
    '/vids/motion_2.0_Indonesian_young_professional_working_at_desk_laptop_open_smartphone_beside_him_-0.mp4',
  ],
  en: [
    '/vids/motion_2.0-fast_POV_shot_of_a_young_person_holding_a_smartphone_clearly_visible_face_and_upper_b-0.mp4',
    '/vids/motion_2.0_Indonesian_young_woman_smiling_gently_while_looking_at_her_smartphone_with_sched-0.mp4',
  ]
}

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [videoIndex, setVideoIndex] = useState(0)
  const { t, language, setLanguage } = useLanguage()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleStartNow = async () => {
    setIsLoading(true)
    await signIn('google', { redirect: true, callbackUrl: '/dashboard' })
  }

  const toggleVideo = () => {
    const langVideos = videos[language as keyof typeof videos] || videos.id
    setVideoIndex((prev) => (prev + 1) % langVideos.length)
  }

  const switchVideoLanguage = (lang: 'id' | 'en') => {
    setLanguage(lang)
    setVideoIndex(0)
  }

  const currentVideo = (videos[language as keyof typeof videos] || videos.id)[videoIndex]

  const stats = [
    { value: '98%', label: 'landing.statTaskCompletion', color: 'default' },
    { value: '2hr+', label: 'landing.statTimeSaved', color: 'primary' },
    { value: '50k+', label: 'landing.statActiveUsers', color: 'default' },
    { value: '4.9/5', label: 'landing.statSatisfaction', color: 'secondary' }
  ]

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      {/* Content */}
      <div className="relative z-10">
        {/* Navbar - Original */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 fixed top-0 left-0 w-full z-50">
          <div className="max-w-[1200px] mx-auto px-10 py-0 h-20 flex justify-between items-center w-full">
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center" aria-label="Go to home">
                <div className="rounded-xl shadow-sm shadow-black/5 dark:shadow-black/10 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-0.5">
                  <Image
                    src="/opt-logo/logo3.png"
                    alt="Smart Task Planner"
                    width={160}
                    height={48}
                    priority
                    className="h-11 w-auto rounded-xl"
                  />
                </div>
              </Link>
              <nav className="hidden md:flex gap-8 items-center">
                <Link href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                  {t('landing.features')}
                </Link>
                <Link href="#pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                  {t('landing.pricing')}
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/auth/signin" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                {t('landing.signIn')}
              </Link>
              <button
                onClick={handleStartNow}
                disabled={isLoading}
                className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-sm"
              >
                {t('landing.getStarted')}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto px-10 pt-32 pb-24 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-medium mb-10 border border-blue-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('landing.aiAssistantBadge')}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-8 max-w-4xl leading-tight">
            <span className="text-slate-900 dark:text-white">{t('landing.planSmarter')}</span>
            <br />
            <span className="text-blue-600 dark:text-blue-400">{t('landing.finishFaster')}</span>
          </h1>

          {/* Description */}
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-14 leading-relaxed opacity-80">
            {t('landing.heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <button
              onClick={handleStartNow}
              disabled={isLoading}
              className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-full text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{t('landing.signInWithGoogle')}</span>
            </button>
            <button onClick={toggleVideo} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-8 py-4 font-medium transition-colors group">
              {t('landing.viewDemo')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Video Preview with Language Switcher */}
          <div className="mt-28 relative w-full max-w-5xl group">
            <div className="absolute -inset-10 bg-gradient-to-tr from-blue-500/5 to-emerald-500/5 rounded-full blur-3xl opacity-60"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-3xl shadow-sm overflow-hidden">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-[1.25rem] overflow-hidden relative">
                <video
                  key={currentVideo}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/logo1.webp"
                >
                  <source src={currentVideo} type="video/mp4" />
                </video>
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-slate-900 dark:text-white ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Video Language Switcher */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                  <button
                    onClick={() => switchVideoLanguage('id')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      language === 'id' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    onClick={() => switchVideoLanguage('en')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      language === 'en' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <div className="w-px h-4 bg-white/30 mx-1"></div>
                  <button
                    onClick={toggleVideo}
                    className="p-1.5 text-white/70 hover:text-white transition-colors"
                    title="Switch video"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div id="features" className="max-w-[1200px] mx-auto px-5 lg:px-10 py-20 lg:py-32">
          <div className="flex flex-col items-center mb-16 lg:mb-24 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">
              {t('landing.builtForClarity')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md opacity-70">
              {t('landing.builtForClarityDesc')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* AI Priority Ranking */}
            <div className="bg-gray-50 dark:bg-gray-900 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="mb-12">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-8">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold mb-4 tracking-tight">{t('landing.aiPriorityTitle')}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md opacity-80 leading-relaxed">{t('landing.aiPriorityDesc')}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-2 h-10 bg-emerald-500 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5"></div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 opacity-50"></div>
                </div>
                <span className="text-emerald-500 font-bold text-[11px] uppercase tracking-wider px-2 py-1 bg-emerald-500/10 rounded">{t('landing.highPriority')}</span>
              </div>
            </div>

            {/* Google Calendar Sync */}
            <div className="bg-gray-50 dark:bg-gray-900 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-lg flex items-center justify-center mb-8">
                <CalendarSync className="w-5 h-5" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-4 tracking-tight">{t('landing.calendarSyncTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-auto opacity-80 leading-relaxed">{t('landing.calendarSyncDesc')}</p>
              <div className="mt-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-center justify-center aspect-video">
                <div className="relative">
                  <CalendarDays className="text-gray-300 dark:text-gray-600 w-16 h-16" />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Natural Language */}
            <div className="bg-gray-50 dark:bg-gray-900 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row items-center gap-10 hover:shadow-lg transition-all duration-300">
              <div className="lg:w-5/12">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mb-8">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold mb-4 tracking-tight">{t('landing.naturalLanguageTitle')}</h3>
                <p className="text-gray-600 dark:text-gray-400 opacity-80 leading-relaxed">{t('landing.naturalLanguageDesc')}</p>
              </div>
              <div className="lg:w-7/12 w-full">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 relative">
                  <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <Brain className="text-blue-500 w-5 h-5" />
                    <span className="text-sm italic">&ldquo;{t('landing.naturalLanguageExample')}&rdquo;</span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-medium">#Meeting</span>
                    <span className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-medium">@Today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-gray-50 dark:bg-gray-900 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row-reverse items-center gap-10 hover:shadow-lg transition-all duration-300">
              <div className="lg:w-5/12">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-lg flex items-center justify-center mb-8">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold mb-4 tracking-tight">{t('landing.whatsappTitle')}</h3>
                <p className="text-gray-600 dark:text-gray-400 opacity-80 leading-relaxed">{t('landing.whatsappDesc')}</p>
              </div>
              <div className="lg:w-7/12 w-full">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl rounded-tl-none">
                        <p className="text-sm">{t('landing.whatsappUserMsg')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none">
                        <p className="text-sm">{t('landing.whatsappBotMsg')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA Banner */}
        <div className="bg-emerald-500/5 py-16 lg:py-24 border-y border-emerald-500/10">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-medium uppercase tracking-widest mb-8">
              {t('landing.bestDeal')}
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">
              {t('landing.whatsappCtaTitle')}<br />{t('landing.whatsappCtaTitle2')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 opacity-80">
              {t('landing.whatsappCtaDesc')}
            </p>
            <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full text-base font-medium hover:opacity-90 transition-all shadow-sm">
              {t('landing.connectWhatsApp')}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className={`text-4xl lg:text-5xl font-bold tracking-tighter ${stat.color === 'primary' ? 'text-blue-600 dark:text-blue-400' : stat.color === 'secondary' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-[10px] font-medium uppercase tracking-widest">
                    {t(stat.label)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-20 lg:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
          <div className="max-w-[1000px] mx-auto px-5 lg:px-10">
            <div className="bg-gray-900 dark:bg-white rounded-[2.5rem] p-16 lg:p-24 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
              <div className="relative z-10">
                <h2 className="text-white dark:text-gray-900 text-3xl lg:text-5xl font-bold mb-8 tracking-tight">
                  {t('landing.stopManaging')}
                </h2>
                <p className="text-white/60 dark:text-gray-600 text-lg max-w-xl mx-auto mb-14">
                  {t('landing.ctaSubtitle')}
                </p>
                <div className="flex flex-col items-center gap-6">
                  <button
                    onClick={handleStartNow}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-sm hover:scale-[1.02]"
                  >
                    {t('landing.getStartedFree')}
                  </button>
                  <p className="text-white/40 dark:text-gray-400 text-[10px] font-medium uppercase tracking-widest">
                    {t('landing.noCreditCard')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-950 py-16 lg:py-24 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Image
                  src="/opt-logo/logo3.png"
                  alt="Smart Task Planner"
                  width={140}
                  height={40}
                  className="h-10 w-auto rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 opacity-70 leading-relaxed">
                {t('landing.footerDesc')}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-900 dark:text-white">{t('landing.product')}</h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.features')}</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.integrations')}</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.pricing')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-900 dark:text-white">{t('landing.resources')}</h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.guides')}</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.community')}</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.support')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-gray-900 dark:text-white">{t('landing.company')}</h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.aboutUs')}</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.blog')}</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.careers')}</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400 opacity-60">
            <span>{t('landing.copyright')}</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t('landing.privacyPolicy')}</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t('landing.termsOfService')}</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
