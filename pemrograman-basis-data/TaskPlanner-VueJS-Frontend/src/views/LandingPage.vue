<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  MessageCircle,
  Play,
  Sparkles,
  BarChart3,
  House,
  LogIn,
  UserPlus,
  Globe,
} from '@lucide/vue'
import { routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'

const stats = [
  { value: '98%', label: 'Task completion', tone: 'default' },
  { value: '2hr+', label: 'Time saved weekly', tone: 'primary' },
  { value: '50k+', label: 'Active users', tone: 'default' },
  { value: '4.9/5', label: 'Satisfaction', tone: 'secondary' },
] as const

const copy = computed(() => {
  if (uiStore.state.language === 'id') {
    return {
      badge: 'Asisten AI untuk perencanaan harian yang lebih rapi',
      titleA: 'Rencanakan lebih cerdas',
      titleB: 'selesaikan lebih cepat',
      desc: 'Smart Task Planner membantu Anda menangkap task, mengatur prioritas, mengelola pengingat, dan tetap fokus dengan bantuan AI yang dirancang untuk produktivitas harian modern.',
      signIn: 'Masuk',
      getStarted: 'Mulai gratis',
      viewDemo: 'Lihat demo',
      built: 'Dibuat untuk kejelasan',
      builtDesc: 'Semua yang Anda butuhkan untuk mengubah jadwal sibuk menjadi prioritas yang jelas, rencana yang rapi, dan progres yang konsisten.',
      priorityTitle: 'Peringkat prioritas AI',
      priorityDesc: 'Sorot pekerjaan yang paling penting dengan insight yang membantu, snapshot progres, dan jalur eksekusi yang lebih jelas.',
      calendarTitle: 'Sinkronisasi ramah kalender',
      calendarDesc: 'Pantau blok waktu, pengingat, dan deadline dari pengalaman planning yang bersih dan fokus.',
      languageTitle: 'Natural language task parsing',
      languageDesc: 'Ubah instruksi harian sederhana menjadi draft task terstruktur agar planning terasa lebih cepat dan natural.',
      finalTitle: 'Rencanakan task lebih cepat dan tetap fokus setiap hari',
      finalDesc: 'Smart Task Planner membantu siapa pun mengatur pekerjaan, menyusun prioritas, dan mengelola rencana harian dengan usaha lebih sedikit.',
      finalCta: 'Coba gratis',
      footerDesc: 'Smart Task Planner membantu semua orang mengatur task, menyusun prioritas harian, dan tetap produktif dengan workflow yang lebih sederhana.',
      features: 'Fitur',
      pricing: 'Statistik',
    }
  }

  return {
    badge: 'AI assistant for smarter daily planning',
    titleA: 'Plan smarter',
    titleB: 'finish faster',
    desc: 'Smart Task Planner helps you capture tasks, organize priorities, manage reminders, and stay focused with AI-powered assistance built for modern daily productivity.',
    signIn: 'Sign in',
    getStarted: 'Get started free',
    viewDemo: 'View demo',
    built: 'Built for clarity',
    builtDesc: 'Everything you need to turn busy schedules into clear priorities, organized plans, and consistent progress.',
    priorityTitle: 'AI priority ranking',
    priorityDesc: 'Highlight the work that matters most with helpful insights, progress snapshots, and a clearer execution path.',
    calendarTitle: 'Calendar-friendly scheduling',
    calendarDesc: 'Stay on top of time blocks, reminders, and upcoming deadlines from a clean planning experience that feels focused.',
    languageTitle: 'Natural language task parsing',
    languageDesc: 'Turn simple everyday instructions into structured task drafts so planning feels faster, easier, and more natural.',
    finalTitle: 'Plan tasks faster and stay focused every day',
    finalDesc: 'Smart Task Planner helps anyone organize work, set priorities, and manage daily plans with less effort.',
    finalCta: 'Try it free',
    footerDesc: 'Smart Task Planner helps everyone organize tasks, plan daily priorities, and stay productive with a simpler workflow.',
    features: 'Features',
    pricing: 'Pricing',
  }
})
</script>

<template>
  <main class="next-landing-page next-landing-page-parity">
    <div class="next-landing-inner">
      <header class="next-landing-header next-landing-header-parity">
        <div class="next-header-content">
          <div class="next-brand-block">
            <RouterLink :to="routePaths.landing" class="next-brand-link" aria-label="Go to home">
              <div class="next-brand-image-wrap">
                <img class="next-brand-image" src="/opt-logo/logo3.png" alt="Smart Task Planner" />
              </div>
            </RouterLink>
            <nav class="next-landing-nav">
              <a href="#features">{{ copy.features }}</a>
              <a href="#pricing">{{ copy.pricing }}</a>
            </nav>
          </div>
          <div class="next-header-actions">
            <button class="next-header-link" type="button" @click="uiStore.toggleLanguage()">
              <Globe :size="16" /> {{ uiStore.state.language === 'en' ? 'ID' : 'EN' }}
            </button>
            <button class="next-header-link" type="button" @click="uiStore.toggleTheme()">
              {{ uiStore.state.theme === 'dark' ? 'Light' : 'Dark' }}
            </button>
            <RouterLink :to="routePaths.authSignin" class="next-header-link">{{ copy.signIn }}</RouterLink>
            <RouterLink :to="routePaths.authSignup" class="next-header-cta">{{ copy.getStarted }}</RouterLink>
          </div>
        </div>
      </header>

      <section class="next-hero-section next-hero-section-parity">
        <div class="next-hero-badge">
          <Sparkles :size="14" />
          <span>{{ copy.badge }}</span>
        </div>

        <h1 class="next-hero-title">
          <span>{{ copy.titleA }}</span>
          <br />
          <span class="accent">{{ copy.titleB }}</span>
        </h1>

        <p class="next-hero-description">
          {{ copy.desc }}
        </p>

        <div class="next-hero-actions next-hero-actions-row">
          <RouterLink :to="routePaths.authSignup" class="next-primary-hero-button next-primary-dark-hero-button">
            <span>{{ copy.getStarted }}</span>
          </RouterLink>
          <a href="#demo" class="next-demo-button">
            {{ copy.viewDemo }} <ArrowRight :size="18" />
          </a>
        </div>

        <div id="demo" class="next-video-shell next-video-shell-parity">
          <div class="next-video-glow"></div>
          <div class="next-video-frame next-demo-frame next-demo-frame-parity">
            <img src="/opt-hero/1.png" alt="Hero preview" class="next-hero-image next-hero-image-clean" />
            <div class="next-video-overlay-button">
              <div class="next-video-play-badge">
                <Play :size="22" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="next-feature-section next-feature-section-parity">
        <div class="next-section-heading">
          <h2>{{ copy.built }}</h2>
          <p>{{ copy.builtDesc }}</p>
        </div>

        <div class="next-feature-grid-two">
          <article class="next-feature-card large">
            <div class="next-icon-box blue"><BarChart3 :size="20" /></div>
            <h3>{{ copy.priorityTitle }}</h3>
            <p>{{ copy.priorityDesc }}</p>
            <div class="next-mini-surface">
              <div class="bar"></div>
              <div class="lines">
                <span></span>
                <span></span>
              </div>
              <small>High priority</small>
            </div>
          </article>

          <article class="next-feature-card large">
            <div class="next-icon-box emerald"><CalendarDays :size="20" /></div>
            <h3>{{ copy.calendarTitle }}</h3>
            <p>{{ copy.calendarDesc }}</p>
            <div class="next-calendar-surface">
              <div class="next-calendar-icon-shell">
                <CalendarDays :size="58" />
                <div class="next-calendar-check-badge">
                  <CheckCircle2 :size="18" />
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="next-feature-row reverse-off">
          <article class="next-feature-row-card">
            <div class="next-row-copy">
              <div class="next-icon-box indigo"><MessageCircle :size="20" /></div>
              <h3>{{ copy.languageTitle }}</h3>
              <p>{{ copy.languageDesc }}</p>
            </div>
            <div class="next-row-surface">
              <div class="next-row-surface-head">
                <Brain :size="18" />
                <span>“Tomorrow 9 AM create sprint planning task for 90 minutes urgent”</span>
              </div>
              <div class="next-tag-row">
                <span>#Meeting</span>
                <span>@Today</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="pricing" class="next-stats-section next-stats-section-parity">
        <div class="next-stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="next-stat-item">
            <div :class="['next-stat-value', `tone-${stat.tone}`]">{{ stat.value }}</div>
            <div class="next-stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <section class="next-final-cta next-final-cta-parity">
        <div class="next-final-cta-card">
          <h2>{{ copy.finalTitle }}</h2>
          <p>{{ copy.finalDesc }}</p>
          <RouterLink :to="routePaths.authSignup" class="next-final-button">{{ copy.finalCta }}</RouterLink>
          <small>Simple task planning for students, teams, and everyday productivity.</small>
        </div>
      </section>

      <footer class="next-footer public-mobile-safe-footer">
        <div class="next-footer-grid">
          <div>
            <img src="/opt-logo/logo3.png" alt="Smart Task Planner" class="next-footer-logo" />
            <p class="next-footer-text">{{ copy.footerDesc }}</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">{{ copy.features }}</a></li>
              <li><a href="#pricing">{{ copy.pricing }}</a></li>
              <li><RouterLink :to="routePaths.dashboard">Dashboard</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><RouterLink :to="routePaths.authSignin">Sign in</RouterLink></li>
              <li><RouterLink :to="routePaths.authSignup">Create account</RouterLink></li>
              <li><RouterLink :to="routePaths.overview">Overview</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#features">About us</a></li>
              <li><a href="#pricing">Terms</a></li>
              <li><a href="#pricing">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div class="next-footer-bottom">
          <span>© 2026 Smart Task Planner. All rights reserved.</span>
          <div>
            <a href="#pricing">Privacy Policy</a>
            <a href="#pricing">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>

    <nav class="mobile-tabbar mobile-tabbar-public" aria-label="Public mobile navigation">
      <RouterLink class="mobile-tab" :to="routePaths.landing">
        <House :size="18" />
        <span>Home</span>
      </RouterLink>
      <a class="mobile-tab" href="/#features">
        <LayoutDashboard :size="18" />
        <span>Features</span>
      </a>
      <RouterLink class="mobile-tab" :to="routePaths.authSignin">
        <LogIn :size="18" />
        <span>Sign in</span>
      </RouterLink>
      <RouterLink class="mobile-tab" :to="routePaths.authSignup">
        <UserPlus :size="18" />
        <span>Register</span>
      </RouterLink>
    </nav>
  </main>
</template>
