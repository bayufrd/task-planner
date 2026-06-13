'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, Smartphone, ArrowRight, QrCode, Bot, Sparkles } from 'lucide-react'

const WHATSAPP_NUMBER = '6285111317767'

const getWhatsappUrl = (userId: string) => {
  const text = `task ${userId} daftar`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

type BackendUser = {
  id?: string | number
}

export default function ConnectWhatsappPage() {
  const { data: session } = useSession()
  const [backendUserId, setBackendUserId] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedUser = localStorage.getItem('backendUser')

    if (!savedUser) return

    try {
      const parsedUser = JSON.parse(savedUser) as BackendUser
      if (parsedUser?.id) {
        setBackendUserId(String(parsedUser.id))
      }
    } catch {
      setBackendUserId('')
    }
  }, [])

  const userId = useMemo(() => {
    const sessionUserId = session?.user && 'id' in session.user ? session.user.id : undefined
    return String(sessionUserId || backendUserId || '').trim()
  }, [backendUserId, session?.user])

  const whatsappUrl = useMemo(() => getWhatsappUrl(userId || 'user_id'), [userId])
  const qrCodeUrl = useMemo(
    () => `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(whatsappUrl)}`,
    [whatsappUrl]
  )

  return (
    <div className="min-h-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <div className="sticky top-0 z-20 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connect to WhatsApp</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Hubungkan akun Task Planner dengan WhatsApp untuk registrasi nomor.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto min-h-[calc(100vh-12rem)] flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-xl shadow-black/5 dark:shadow-black/20 p-8 sm:p-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400 shadow-lg shadow-green-500/10">
              <MessageCircle className="h-10 w-10" strokeWidth={2.2} />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Connect your WhatsApp
              </h2>
              <p className="text-sm sm:text-base leading-7 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Klik tombol di bawah untuk membuka WhatsApp ke nomor gateway dan mengirim format registrasi otomatis.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-gray-900/70 p-5 sm:p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <QrCode className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Scan QR WhatsApp</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Scan QR ini dari perangkat lain untuk langsung membuka chat WhatsApp dengan format pesan yang sudah terisi.
                </p>
                <div className="mt-4 inline-flex rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                  <Image
                    src={qrCodeUrl}
                    alt="WhatsApp QR Code"
                    width={240}
                    height={240}
                    unoptimized
                    className="h-52 w-52 rounded-xl sm:h-60 sm:w-60"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-gray-900/70 p-5 sm:p-6 text-left">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="mt-0.5 rounded-2xl bg-blue-100 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-400">
                    <Smartphone className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                        Nomor tujuan
                      </p>
                      <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                        +62 851-1131-7767
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                        Pesan otomatis
                      </p>
                      <code className="mt-1 block rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 break-all">
                        {`task ${userId || 'user_id'} daftar`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200/70 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-900 p-5 sm:p-6 text-left">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="mt-0.5 rounded-2xl bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-600 dark:text-amber-300">
                    <Bot className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="flex-1 space-y-4 text-center sm:text-left">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Tips pakai bot WhatsApp Task Planner</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        Supaya bot mengenali pesan Anda dengan benar, mulai chat dengan kata <span className="font-semibold text-gray-900 dark:text-white">task</span>. Setelah itu, tulis kebutuhan Anda dengan gaya santai seperti sedang chat biasa — AI akan membantu membaca maksud Anda.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Mulai dengan trigger</p>
                        <code className="mt-2 block text-sm text-emerald-600 dark:text-emerald-400 break-all">task bantuan</code>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Gunakan ini kalau ingin lihat menu bantuan dan contoh command yang tersedia.</p>
                      </div>

                      <div className="rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Tulis natural saja</p>
                        <code className="mt-2 block text-sm text-emerald-600 dark:text-emerald-400 break-all">task tambah meeting besok jam 10 malam #urgent</code>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">AI akan bantu membaca judul task, waktu, dan konteks penting dari pesan Anda.</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800/70 p-4">
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                        <Sparkles className="h-4 w-4 text-amber-500" strokeWidth={2} />
                        <span>Contoh yang bisa Anda kirim</span>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
                        <li><code className="text-emerald-600 dark:text-emerald-400">task bantuan</code> untuk melihat panduan cepat</li>
                        <li><code className="text-emerald-600 dark:text-emerald-400">task lihat jadwal besok</code> untuk cek task yang akan datang</li>
                        <li><code className="text-emerald-600 dark:text-emerald-400">task selesai meeting client</code> untuk menandai task selesai</li>
                        <li><code className="text-emerald-600 dark:text-emerald-400">task overview</code> untuk melihat ringkasan task Anda</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/40"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
                  Open WhatsApp
                  <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
                </Link>

                {!userId && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                    User ID belum terdeteksi otomatis. Tombol tetap aktif dengan placeholder `user_id`.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
