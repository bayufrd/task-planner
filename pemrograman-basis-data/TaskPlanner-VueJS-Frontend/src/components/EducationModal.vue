<script setup lang="ts">
import { ref } from 'vue'
import { X, BrainCircuit, Calculator, Gauge } from '@lucide/vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const dontShowAgain = ref(false)

function close() {
  if (dontShowAgain.value) {
    localStorage.setItem('hide-education-modal', 'true')
  }
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
      <button @click="close" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <X :size="20" />
      </button>

      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-100 rounded-xl text-blue-600">
            <BrainCircuit :size="24" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Smart Task Planner</h2>
        </div>

        <div class="space-y-6 text-gray-600 dark:text-gray-300 text-sm">
          <!-- Adaptive Syllabus -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-blue-600 font-bold">
              <Calculator :size="18" />
              <h3>Adaptive Syllabus (Scoring Logic)</h3>
            </div>
            <p>Prioritas task dihitung berdasarkan formula:</p>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-xs">
              Score = (Urgency * 0.4) + (Priority * 0.35) + (Reminder * 0.15) + (Duration * 0.1)
            </div>
            <ul class="list-disc pl-4 space-y-1 text-xs">
              <li><strong>Urgency:</strong> Overdue (100), Hari ini (95), Besok (85), < 3 hari (70).</li>
              <li><strong>Priority:</strong> High (90), Medium (60), Low (30).</li>
              <li><strong>Duration:</strong> < 15 menit (80), > 4 jam (20).</li>
            </ul>
          </div>

          <!-- Adaptive Behavioral -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-purple-600 font-bold">
              <Gauge :size="18" />
              <h3>Adaptive Behavioral Insights</h3>
            </div>
            <p>Sistem menilai kebiasaan Anda. Analogi:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p class="font-semibold text-purple-700 dark:text-purple-300">"Siput Loading"</p>
                <p class="text-xs">Ada niat, tapi progress lambat. <em>Tips: Targetkan 15 menit fokus.</em></p>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p class="font-semibold text-purple-700 dark:text-purple-300">"Naga Deadline"</p>
                <p class="text-xs">Mode legenda, task tunduk semua. <em>Tips: Pertahankan standar tinggi!</em></p>
              </div>
            </div>
          </div>
        </div>

        <button @click="close" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors mb-3">
          Mengerti
        </button>
        <div class="mt-3 flex justify-start">
  <label for="dontShow" class="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      id="dontShow"
      v-model="dontShowAgain"
      class="rounded text-blue-600"
    />
    <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
      Jangan tampilkan lagi
    </span>
  </label>
</div>
      </div>
    </div>
  </div>
</template>
