<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  Brain,
  MessageCircle,
  Play,
  Sparkles,
  Bot,
  CalendarSync,
  Moon,
  Sun,
} from '@lucide/vue'
import { routePaths } from '../router/registry'
import { uiStore } from '../stores/ui'

const videoIndex = ref(0)
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

const currentVideo = computed(() => {
  const lang = uiStore.state.language as 'id' | 'en'
  return videos[lang][videoIndex.value]
})

const toggleVideo = () => {
  const lang = uiStore.state.language as 'id' | 'en'
  videoIndex.value = (videoIndex.value + 1) % videos[lang].length
}

const copy = computed(() => {
  if (uiStore.state.language === 'id') {
    return {
      badge: 'Asisten AI untuk perencanaan harian yang lebih rapi',
      titleA: 'Rencanakan lebih cerdas',
      titleB: 'selesaikan lebih cepat',
      desc: 'Smart Task Planner membantu Anda menangkap task, mengatur prioritas, mengelola pengingat, dan tetap fokus dengan bantuan AI yang dirancang untuk produktivitas harian modern.',
      signIn: 'SIGN IN',
      getStarted: 'Mulai gratis',
      viewDemo: 'Lihat demo',
      features: 'Fitur',
      pricing: 'Statistik',
      statTaskCompletion: 'Penyelesaian Task',
      statTimeSaved: 'Waktu Terhemat',
      statActiveUsers: 'Pengguna Aktif',
      statSatisfaction: 'Kepuasan',
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
    }
  }

  return {
    badge: 'AI assistant for smarter daily planning',
    titleA: 'Plan smarter',
    titleB: 'finish faster',
    desc: 'Smart Task Planner helps you capture tasks, organize priorities, manage reminders, and stay focused with AI-powered assistance built for modern daily productivity.',
    signIn: 'SIGN IN',
    getStarted: 'Get started free',
    viewDemo: 'View demo',
    features: 'Features',
    pricing: 'Pricing',
    statTaskCompletion: 'Task Completion',
    statTimeSaved: 'Time Saved',
    statActiveUsers: 'Active Users',
    statSatisfaction: 'Satisfaction',
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
  }
})

const stats = computed(() => [
  { value: '98%', label: copy.value.statTaskCompletion, color: 'default' },
  { value: '2hr+', label: copy.value.statTimeSaved, color: 'primary' },
  { value: '50k+', label: copy.value.statActiveUsers, color: 'default' },
  { value: '4.9/5', label: copy.value.statSatisfaction, color: 'secondary' }
])
</script>

<template>
  <div class="min-h-screen w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors duration-300">
    <!-- Content -->
    <div class="relative z-10">
      <!-- Navbar -->
      <header class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-10">
              <RouterLink :to="routePaths.landing" class="flex items-center" aria-label="Go to home">
                <div class="rounded-xl shadow-sm shadow-black/5 dark:shadow-black/10 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-0.5">
                  <img src="/opt-logo/logo3.webp" alt="Smart Task Planner" class="h-11 w-auto rounded-xl" />
                </div>
              </RouterLink>
              <nav class="hidden md:flex gap-8 items-center">
                <a href="#features" class="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                  {{ copy.features }}
                </a>
                <a href="#pricing" class="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                  {{ copy.pricing }}
                </a>
              </nav>
            </div>

            <div class="flex items-center gap-1">
              <!-- Language Toggle Switch -->
              <div class="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
                <button
                  @click="uiStore.setLanguage('id')"
                  class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
                  :class="uiStore.state.language === 'id' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                >
                  ID
                </button>
                <button
                  @click="uiStore.setLanguage('en')"
                  class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
                  :class="uiStore.state.language === 'en' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                >
                  EN
                </button>
              </div>

              <!-- Theme Toggle -->
              <button
                @click="uiStore.toggleTheme()"
                class="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 text-gray-700 dark:text-gray-300"
              >
                <Moon v-if="uiStore.state.theme === 'light'" class="w-5 h-5" :stroke-width="2" />
                <Sun v-else class="w-5 h-5" :stroke-width="2" />
              </button>

              <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

              <RouterLink
                :to="routePaths.authSignin"
                class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-sm"
                :key="uiStore.state.language"
              >
                {{ copy.signIn }}
              </RouterLink>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="pt-40 pb-20 px-6 md:px-10 max-w-[1200px] mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
              <Sparkles class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span class="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">{{ copy.badge }}</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              {{ copy.titleA }} <span class="text-blue-600">{{ copy.titleB }}</span>
            </h1>
            
            <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              {{ copy.desc }}
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <RouterLink 
                :to="routePaths.authSignin"
                class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 group active:scale-95"
              >
                {{ copy.signIn }}
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </RouterLink>
              
              <button 
                @click="toggleVideo"
                class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-center gap-3 active:scale-95"
              >
                <Play class="w-5 h-5 fill-current" />
                {{ copy.viewDemo }}
              </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-slate-100 dark:border-slate-800">
              <div v-for="stat in stats" :key="stat.label" class="space-y-1">
                <div :class="[
                  'text-2xl font-black',
                  stat.color === 'primary' ? 'text-blue-600' : 
                  stat.color === 'secondary' ? 'text-indigo-600 dark:text-indigo-400' : 
                  'text-slate-900 dark:text-white'
                ]">
                  {{ stat.value }}
                </div>
                <div class="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- Hero Visual -->
          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-[40px] blur-2xl group-hover:opacity-75 transition-opacity"></div>
            <div class="relative bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-800/50 aspect-[4/3]">
              <video 
                :key="currentVideo"
                autoplay 
                muted 
                loop 
                playsinline
                class="w-full h-full object-cover opacity-80"
              >
                <source :src="currentVideo" type="video/mp4" />
              </video>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div class="absolute bottom-8 left-8 right-8">
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Brain class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-bold text-white">AI Analysis in progress...</div>
                    <div class="text-xs text-slate-400">Optimizing your daily schedule</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-32 px-6 md:px-10 max-w-[1200px] mx-auto">
        <div class="text-center space-y-4 mb-20">
          <h2 class="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">{{ copy.built }}</h2>
          <p class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
            {{ copy.builtDesc }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group p-10 rounded-[32px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2">
            <div class="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Bot class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-black mb-4 text-slate-900 dark:text-white">{{ copy.priorityTitle }}</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ copy.priorityDesc }}
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group p-10 rounded-[32px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2">
            <div class="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
              <CalendarSync class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-black mb-4 text-slate-900 dark:text-white">{{ copy.calendarTitle }}</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ copy.calendarDesc }}
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group p-10 rounded-[32px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-2">
            <div class="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <MessageCircle class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-black mb-4 text-slate-900 dark:text-white">{{ copy.languageTitle }}</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ copy.languageDesc }}
            </p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 px-6 md:px-10 max-w-[1200px] mx-auto">
        <div class="relative rounded-[48px] bg-blue-600 p-12 md:p-24 overflow-hidden text-center space-y-10">
          <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          
          <div class="relative z-10 space-y-6">
            <h2 class="text-4xl md:text-6xl font-black text-white leading-tight max-w-4xl mx-auto">
              {{ copy.finalTitle }}
            </h2>
            <p class="text-xl text-blue-100 max-w-2xl mx-auto">
              {{ copy.finalDesc }}
            </p>
          </div>
          
          <div class="relative z-10 pt-4">
            <RouterLink 
              :to="routePaths.authSignup"
              class="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl text-xl font-black transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
            >
              {{ copy.finalCta }}
              <ArrowRight class="w-6 h-6" />
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-20 px-6 md:px-10 border-t border-slate-100 dark:border-slate-800 max-w-[1200px] mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-start">
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="rounded-xl shadow-sm shadow-black/5 dark:shadow-black/10 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-0.5">
                <img src="/opt-logo/logo3.webp" alt="Smart Task Planner" class="h-10 w-auto rounded-xl" />
              </div>
              <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white">TaskPlanner</span>
            </div>
            <p class="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {{ copy.footerDesc }}
            </p>
          </div>
          
          <div class="flex flex-col md:items-end gap-8">
            <div class="flex gap-8">
              <a href="#" class="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Twitter</a>
              <a href="#" class="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">GitHub</a>
              <a href="#" class="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Discord</a>
            </div>
            <div class="text-sm text-slate-400 dark:text-slate-500 font-medium">
              © 2024 Smart Task Planner. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Background Decoration -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/5 blur-[120px]"></div>
    </div>
  </div>
</template>

<style scoped>
.next-landing-page-parity {
  scroll-behavior: smooth;
}

/* Custom scrollbar for better parity */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
  border: 3px solid transparent;
  background-clip: content-box;
}

.dark ::-webkit-scrollbar-thumb {
  background: #334155;
  border: 3px solid transparent;
  background-clip: content-box;
}
</style>
