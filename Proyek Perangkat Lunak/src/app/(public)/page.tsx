'use client'

import Image from 'next/image'
import Link from 'next/link'
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
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

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
      title: t('landing.features.aiPowered'),
      description: t('landing.features.aiPoweredDesc')
    },
    {
      icon: Zap,
      title: t('landing.features.smartAutomation'),
      description: t('landing.features.smartAutomationDesc')
    },
    {
      icon: Watch,
      title: t('landing.features.wearableIntegration'),
      description: t('landing.features.wearableIntegrationDesc')
    },
    {
      icon: BarChart3,
      title: t('landing.features.productivityInsights'),
      description: t('landing.features.productivityInsightsDesc')
    }
  ]

  const phases = [
    {
      phase: 'Phase 1',
      title: t('landing.phaseMVPLaunch'),
      features: ['Task automation with AI', 'AI task assistant (chat)', 'Time blocking & focus mode']
    },
    {
      phase: 'Phase 1.5',
      title: t('landing.phaseFirstMonth'),
      features: ['Smart suggestions', 'Habit stacking & streaks', 'Deadline negotiation']
    },
    {
      phase: 'Phase 2',
      title: t('landing.phaseGrowth'),
      features: ['Workload balancing', 'Advanced analytics', 'Cross-device sync']
    }
  ]

  const topFeatures = [
    {
      number: '1',
      title: t('landing.feature1Title'),
      description: t('landing.feature1Desc'),
      impact: t('landing.feature1Impact')
    },
    {
      number: '2',
      title: t('landing.feature2Title'),
      description: t('landing.feature2Desc'),
      impact: t('landing.feature2Impact')
    },
    {
      number: '3',
      title: t('landing.feature3Title'),
      description: t('landing.feature3Desc'),
      impact: t('landing.feature3Impact')
    }
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl dark:bg-blue-900/20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl dark:bg-indigo-900/20"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl dark:bg-cyan-900/10 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="border-b border-white/20 dark:border-gray-800/50 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center" aria-label="Go to home">
              <Image
                src="/logo3.webp"
                alt="Smart Task Planner"
                width={160}
                height={48}
                priority
                className="h-11 w-auto"
              />
            </Link>
            <button
              onClick={handleStartNow}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              {isLoading ? t('landing.signingIn') : 'Sign In'}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="space-y-8 text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{t('landing.aiPowerTaskPlanning')}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight">
                <span className="block text-gray-900 dark:text-white">
                  {t('landing.planSmarter')}
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('landing.workBetter')}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t('landing.description')}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={handleStartNow}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('landing.signingIn')}
                  </>
                ) : (
                  <>
                    {t('landing.startNow')}
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </>
                )}
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              {t('landing.trustBadge')}
            </div>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.whyChoose')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.whyChooseDesc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top 3 Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.topFeatures')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.topFeaturesDesc')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {topFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm p-8 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {feature.number}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {feature.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.phases')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.phasesDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {phases.map((item, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                {/* Timeline Connector */}
                {index < phases.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
                )}

                <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
                  {item.phase}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-3">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                      <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* All 10 Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('landing.allFeatures')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.allFeaturesDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-blue-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">🤖</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature1')}</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">{t('landing.feature1Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature1Text')}</p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-purple-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">💬</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature2')}</h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">{t('landing.feature2Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature2Text')}</p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-pink-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature3')}</h4>
                  <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold mt-1">{t('landing.feature3Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature3Text')}</p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-orange-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">⏱️</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature4')}</h4>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-1">{t('landing.feature4Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature4Text')}</p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-red-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">🔥</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature5')}</h4>
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">{t('landing.feature5Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature5Text')}</p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-green-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">⚖️</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature6')}</h4>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">{t('landing.feature6Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature6Text')}</p>
            </div>

            {/* Feature 7 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-cyan-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">📅</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature7')}</h4>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold mt-1">{t('landing.feature7Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature7Text')}</p>
            </div>

            {/* Feature 8 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-indigo-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">📱</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature8')}</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{t('landing.feature8Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature8Text')}</p>
            </div>

            {/* Feature 9 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-teal-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">📈</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature9')}</h4>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-1">{t('landing.feature9Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature9Text')}</p>
            </div>

            {/* Feature 10 */}
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 hover:border-violet-400/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">👥</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('landing.feature10')}</h4>
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold mt-1">{t('landing.feature10Meta')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('landing.feature10Text')}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="rounded-3xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm p-12 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('landing.ctaDesc')}
            </p>
            <button
              onClick={handleStartNow}
              disabled={isLoading}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-500 disabled:to-indigo-500 text-white rounded-xl font-bold text-lg transition-all duration-200 inline-flex items-center gap-2 shadow-2xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('landing.signingIn')}
                </>
              ) : (
                <>
                  {t('landing.startNow')}
                  <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('landing.footer')}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.privacyLink')}</a>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('landing.termsLink')}</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
