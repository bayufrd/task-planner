<script setup lang="ts">
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
} from '@lucide/vue'

const stats = [
  { value: '98%', label: 'Task completion', tone: 'default' },
  { value: '2hr+', label: 'Time saved weekly', tone: 'primary' },
  { value: '50k+', label: 'Active users', tone: 'default' },
  { value: '4.9/5', label: 'Satisfaction', tone: 'secondary' },
]
</script>

<template>
  <main class="next-landing-page">
    <div class="next-landing-inner">
      <header class="next-landing-header">
        <div class="next-header-content">
          <div class="next-brand-block">
            <RouterLink to="/" class="next-brand-link" aria-label="Go to home">
              <div class="next-brand-image-wrap">
                <img class="next-brand-image" src="/opt-logo/logo3.png" alt="Smart Task Planner" />
              </div>
            </RouterLink>
            <nav class="next-landing-nav">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
            </nav>
          </div>
          <div class="next-header-actions">
            <RouterLink to="/login" class="next-header-link">Sign in</RouterLink>
            <RouterLink to="/register" class="next-header-cta">Get started</RouterLink>
          </div>
        </div>
      </header>

      <section class="next-hero-section">
        <div class="next-hero-badge">
          <Sparkles :size="14" />
          <span>AI assistant for smarter daily planning</span>
        </div>

        <h1 class="next-hero-title">
          <span>Plan smarter</span>
          <br />
          <span class="accent">finish faster</span>
        </h1>

        <p class="next-hero-description">
          Smart Task Planner helps you capture tasks, organize priorities, manage reminders, and stay focused with AI-powered
          assistance built for modern daily productivity.
        </p>

        <div class="next-hero-actions next-hero-actions-row">
          <RouterLink to="/register" class="next-primary-hero-button next-primary-dark-hero-button">
            <span>Get started free</span>
          </RouterLink>
          <a href="#demo" class="next-demo-button">
            View demo <ArrowRight :size="18" />
          </a>
        </div>

        <div id="demo" class="next-video-shell">
          <div class="next-video-glow"></div>
          <div class="next-video-frame next-demo-frame">
            <img src="/opt-hero/1.png" alt="Hero preview" class="next-hero-image next-hero-image-clean" />
            <div class="next-video-overlay-button">
              <div class="next-video-play-badge">
                <Play :size="22" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="next-feature-section">
        <div class="next-section-heading">
          <h2>Built for clarity</h2>
          <p>Everything you need to turn busy schedules into clear priorities, organized plans, and consistent progress.</p>
        </div>

        <div class="next-feature-grid-two">
          <article class="next-feature-card large">
            <div class="next-icon-box blue"><BarChart3 :size="20" /></div>
            <h3>AI priority ranking</h3>
            <p>Highlight the work that matters most with helpful insights, progress snapshots, and a clearer execution path.</p>
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
            <h3>Calendar-friendly scheduling</h3>
            <p>Stay on top of time blocks, reminders, and upcoming deadlines from a clean planning experience that feels focused.</p>
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
              <h3>Natural language task parsing</h3>
              <p>Turn simple everyday instructions into structured task drafts so planning feels faster, easier, and more natural.</p>
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

      <section id="pricing" class="next-stats-section">
        <div class="next-stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="next-stat-item">
            <div :class="['next-stat-value', `tone-${stat.tone}`]">{{ stat.value }}</div>
            <div class="next-stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <section class="next-final-cta">
        <div class="next-final-cta-card">
          <h2>Plan tasks faster and stay focused every day</h2>
          <p>Smart Task Planner helps anyone organize work, set priorities, and manage daily plans with less effort.</p>
          <RouterLink to="/register" class="next-final-button">Try it free</RouterLink>
          <small>Simple task planning for students, teams, and everyday productivity.</small>
        </div>
      </section>

      <footer class="next-footer public-mobile-safe-footer">
        <div class="next-footer-grid">
          <div>
            <img src="/opt-logo/logo3.png" alt="Smart Task Planner" class="next-footer-logo" />
            <p class="next-footer-text">
              Smart Task Planner helps everyone organize tasks, plan daily priorities, and stay productive with a simpler workflow.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><RouterLink to="/login">Sign in</RouterLink></li>
              <li><RouterLink to="/register">Create account</RouterLink></li>
              <li><RouterLink to="/overview">Overview</RouterLink></li>
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
      <RouterLink class="mobile-tab" to="/">
        <House :size="18" />
        <span>Home</span>
      </RouterLink>
      <a class="mobile-tab" href="/#features">
        <LayoutDashboard :size="18" />
        <span>Features</span>
      </a>
      <RouterLink class="mobile-tab" to="/login">
        <LogIn :size="18" />
        <span>Sign in</span>
      </RouterLink>
      <RouterLink class="mobile-tab" to="/register">
        <UserPlus :size="18" />
        <span>Register</span>
      </RouterLink>
    </nav>
  </main>
</template>
