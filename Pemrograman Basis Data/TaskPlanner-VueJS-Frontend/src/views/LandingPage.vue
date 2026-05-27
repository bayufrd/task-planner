<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight, Brain, CheckCircle2, LayoutDashboard, BellRing } from '@lucide/vue'
</script>

<template>
  <main class="landing-page">
    <section class="hero-section">
      <div class="hero-copy">
        <span class="eyebrow">Vue frontend for Task Planner</span>
        <h1>Plan smarter with the Java backend you already have.</h1>
        <p>
          This Vue.js frontend mirrors the product feel of the Next.js reference project,
          but only keeps features that exist in the current Java Spring Boot API.
        </p>
        <div class="hero-actions">
          <RouterLink class="primary-button" to="/register">Get started <ArrowRight :size="18" /></RouterLink>
          <RouterLink class="ghost-button" to="/login">Sign in</RouterLink>
        </div>
      </div>
      <div class="hero-card panel">
        <h2>Included frontend modules</h2>
        <ul class="feature-list">
          <li><LayoutDashboard :size="18" /> Dashboard with tasks, stats, planner, and charts</li>
          <li><BellRing :size="18" /> Reminder management for implemented reminder endpoints</li>
          <li><Brain :size="18" /> AI helper for parse-task and overview-analysis</li>
          <li><CheckCircle2 :size="18" /> JWT auth only, English only, single default theme</li>
        </ul>
      </div>
    </section>
  </main>
</template>
