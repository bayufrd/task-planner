<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  Brain,
  Sparkles,
  Bot,
  MessageCircle,
  Users,
  BarChart3,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  House,
  LogIn,
  UserPlus,
} from '@lucide/vue'


const stats = [
  { value: '98%', label: 'Task completion' },
  { value: '2hr+', label: 'Time saved weekly' },
  { value: '24/7', label: 'Planning support' },
  { value: 'AI', label: 'Parsing assistance' },
]

const collectionImages = [
  '/collection/62shots_so.png',
  '/collection/356shots_so.png',
  '/collection/400shots_so.png',
  '/collection/554shots_so.png',
  '/collection/594shots_so.png',
  '/collection/632shots_so.png',
  '/collection/635shots_so.png',
  '/collection/767shots_so.png',
]

const currentCollectionSlide = ref(0)

function goToCollectionSlide(index: number) {
  currentCollectionSlide.value = index
}

function goToPrevCollectionSlide() {
  currentCollectionSlide.value = currentCollectionSlide.value === 0
    ? collectionImages.length - 1
    : currentCollectionSlide.value - 1
}

function goToNextCollectionSlide() {
  currentCollectionSlide.value = currentCollectionSlide.value === collectionImages.length - 1
    ? 0
    : currentCollectionSlide.value + 1
}
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
              <a href="#start-now">Try now</a>
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
          <span>Smarter planning for your daily flow</span>
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

        <div class="next-hero-actions">
          <RouterLink to="/register" class="next-primary-hero-button">
            <span>Get started free</span>
          </RouterLink>
          <RouterLink to="/login" class="next-demo-button">
            Sign in <ArrowRight :size="18" />
          </RouterLink>
        </div>

        <div class="next-video-shell">
          <div class="next-video-glow"></div>
          <div class="next-video-frame">
            <img src="/opt-hero/1.png" alt="Hero preview" class="next-hero-image" />
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
            <div class="next-icon-box emerald"><LayoutDashboard :size="20" /></div>
            <h3>Focused dashboard workflow</h3>
            <p>Track tasks, review reminders, and stay on top of your schedule from a clean workspace designed for daily momentum.</p>
            <div class="next-dashboard-surface">
              <div class="next-dashboard-surface-card large"></div>
              <div class="next-dashboard-surface-row">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="next-dashboard-surface-grid">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
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

        <div class="next-feature-row reverse-on">
          <article class="next-feature-row-card reverse">
            <div class="next-row-copy">
              <div class="next-icon-box whatsapp"><MessageCircle :size="20" /></div>
              <h3>Conversational task flow</h3>
              <p>Use a chat-like experience to shape ideas into actionable tasks and keep your planning process feeling effortless.</p>
            </div>
            <div class="next-chat-surface">
              <div class="chat-message left">
                <div class="chat-avatar user"><Users :size="14" /></div>
                <div class="chat-bubble">Create a high priority report task for tomorrow morning.</div>
              </div>
              <div class="chat-message right">
                <div class="chat-avatar bot"><Bot :size="14" /></div>
                <div class="chat-bubble bot">Task draft parsed. You can review and save it from the AI helper page.</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="next-collection-section">
        <div class="next-collection-heading">
          <h2>Our Feature Collection</h2>
          <p>Explore the product moments that make Smart Task Planner feel intuitive, focused, and ready for everyday use.</p>
        </div>
        <div class="next-collection-carousel">
          <div class="next-collection-track" :style="{ transform: `translateX(-${currentCollectionSlide * 100}%)` }">
            <article v-for="image in collectionImages" :key="image" class="next-collection-slide">
              <div class="next-collection-card">
                <img :src="image" alt="Feature collection preview" class="next-collection-image" />
              </div>
            </article>
          </div>

          <button type="button" class="next-collection-nav prev" aria-label="Previous slide" @click="goToPrevCollectionSlide">
            <ChevronLeft :size="22" />
          </button>
          <button type="button" class="next-collection-nav next" aria-label="Next slide" @click="goToNextCollectionSlide">
            <ChevronRight :size="22" />
          </button>
        </div>

        <div class="next-collection-dots">
          <button
            v-for="(_, index) in collectionImages"
            :key="`dot-${index}`"
            type="button"
            :class="['next-collection-dot', { active: index === currentCollectionSlide }]"
            :aria-label="`Go to slide ${index + 1}`"
            @click="goToCollectionSlide(index)"
          />
        </div>
      </section>

      <section class="next-banner-cta" id="start-now">
        <div class="pill">Try it now</div>
        <h2>Make task planning simpler for everyone</h2>
        <p>Capture tasks faster, organize priorities clearly, and keep your day on track in one simple workspace.</p>
        <RouterLink to="/register" class="next-dark-button">Try Smart Task Planner</RouterLink>
      </section>

      <section class="next-stats-section">
        <div class="next-stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="next-stat-item">
            <div class="next-stat-value">{{ stat.value }}</div>
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
              <li><a href="#start-now">Try Now</a></li>
              <li><a href="#features">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><RouterLink to="/login">Sign in</RouterLink></li>
              <li><RouterLink to="/register">Create account</RouterLink></li>
              <li><a href="#start-now">Get Started</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@smarttaskplanner.app">hello@smarttaskplanner.app</a></li>
              <li><a href="mailto:support@smarttaskplanner.app">support@smarttaskplanner.app</a></li>
              <li><a href="#start-now">Start Planning</a></li>
            </ul>
          </div>
        </div>
        <div class="next-footer-bottom">
          <span>© 2026 Smart Task Planner. All rights reserved.</span>
          <div>
            <a href="#features">Overview</a>
            <a href="mailto:hello@smarttaskplanner.app">Contact</a>
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
