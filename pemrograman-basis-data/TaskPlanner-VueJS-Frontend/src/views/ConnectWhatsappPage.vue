<script setup lang="ts">
import { computed } from 'vue'
import { MessageCircle, Smartphone, ArrowRight, QrCode, Bot, Sparkles } from '@lucide/vue'
import { authStore } from '../stores/auth'

const WHATSAPP_NUMBER = '6285111317767'

const userId = computed(() => {
  return String(authStore.state.user?.id || '').trim()
})

const whatsappUrl = computed(() => {
  const id = userId.value || 'user_id'
  const text = `task ${id} daftar`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
})

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(whatsappUrl.value)}`
})
</script>

<template>
  <div class="min-h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
    <div class="sticky top-0 z-20 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Connect to WhatsApp</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Hubungkan akun Task Planner dengan WhatsApp untuk registrasi nomor.
        </p>
      </div>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div class="max-w-6xl mx-auto min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div class="w-full max-w-2xl rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-xl shadow-black/5 dark:shadow-black/20 p-8 sm:p-10 text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400 shadow-lg shadow-green-500/10">
            <MessageCircle class="h-10 w-10" :stroke-width="2.2" />
          </div>

          <div class="space-y-3">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Connect your WhatsApp
            </h2>
            <p class="text-sm sm:text-base leading-7 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Klik tombol di bawah untuk membuka WhatsApp ke nomor gateway dan mengirim format registrasi otomatis.
            </p>
          </div>

          <div class="mt-8 space-y-6">
            <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-gray-900/70 p-5 sm:p-6 text-center">
              <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <QrCode class="h-6 w-6" :stroke-width="2" />
              </div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Scan QR WhatsApp</h3>
              <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                Scan QR ini dari perangkat lain untuk langsung membuka chat WhatsApp dengan format pesan yang sudah terisi.
              </p>
              <div class="mt-4 inline-flex rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                <img
                  :src="qrCodeUrl"
                  alt="WhatsApp QR Code"
                  class="h-52 w-52 rounded-xl sm:h-60 sm:w-60"
                />
              </div>
            </div>

            <div class="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-gray-900/70 p-5 sm:p-6 text-left">
              <div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div class="mt-0.5 rounded-2xl bg-blue-100 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-400">
                  <Smartphone class="h-5 w-5" :stroke-width="2" />
                </div>
                <div class="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                      Nomor tujuan
                    </p>
                    <p class="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                      +62 851-1131-7767
                    </p>
                  </div>

                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                      Pesan otomatis
                    </p>
                    <code class="mt-1 block rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 break-all">
                      task {{ userId || 'user_id' }} daftar
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-amber-200/70 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900 p-5 sm:p-6 text-left">
              <div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div class="mt-0.5 rounded-2xl bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-600 dark:text-amber-300">
                  <Bot class="h-5 w-5" :stroke-width="2" />
                </div>
                <div class="flex-1 space-y-4 text-center sm:text-left">
                  <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">Tips pakai bot WhatsApp Task Planner</h3>
                    <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      Supaya bot mengenali pesan Anda dengan benar, mulai chat dengan kata <span class="font-semibold text-gray-900 dark:text-white">task</span>. Setelah itu, tulis kebutuhan Anda dengan gaya santai seperti sedang chat biasa — AI akan membantu membaca maksud Anda.
                    </p>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <div class="rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 p-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Mulai dengan trigger</p>
                      <code class="mt-2 block text-sm text-emerald-600 dark:text-emerald-400 break-all">task bantuan</code>
                      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Gunakan ini kalau ingin lihat menu bantuan dan contoh command yang tersedia.</p>
                    </div>

                    <div class="rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 p-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Tulis natural saja</p>
                      <code class="mt-2 block text-sm text-emerald-600 dark:text-emerald-400 break-all">task tambah meeting besok jam 10 malam #urgent</code>
                      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">AI akan bantu membaca judul task, waktu, dan konteks penting dari pesan Anda.</p>
                    </div>
                  </div>

                  <div class="rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 p-4">
                    <div class="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                      <Sparkles class="h-4 w-4 text-amber-500" :stroke-width="2" />
                      <span>Contoh yang bisa Anda kirim</span>
                    </div>
                    <ul class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
                      <li><code class="text-emerald-600 dark:text-emerald-400">task bantuan</code> untuk melihat panduan cepat</li>
                      <li><code class="text-emerald-600 dark:text-emerald-400">task lihat jadwal besok</code> untuk cek task yang akan datang</li>
                      <li><code class="text-emerald-600 dark:text-emerald-400">task selesai meeting client</code> untuk menandai task selesai</li>
                      <li><code class="text-emerald-600 dark:text-emerald-400">task overview</code> untuk melihat ringkasan task Anda</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-center gap-4">
              <a
                :href="whatsappUrl"
                target="_blank"
                rel="noreferrer"
                class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/40"
              >
                <MessageCircle class="h-5 w-5" :stroke-width="2.2" />
                Open WhatsApp
                <ArrowRight class="h-5 w-5" :stroke-width="2.2" />
              </a>

              <p v-if="!userId" class="text-sm text-amber-600 dark:text-amber-400 text-center">
                User ID belum terdeteksi otomatis. Tombol tetap aktif dengan placeholder `user_id`.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
