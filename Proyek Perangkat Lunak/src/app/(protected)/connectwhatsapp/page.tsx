'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, Smartphone, ArrowRight } from 'lucide-react'

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

            <div className="mt-8 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-gray-900/70 p-5 sm:p-6 text-left">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-2xl bg-blue-100 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-400">
                  <Smartphone className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="flex-1 space-y-3">
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

            <div className="mt-8 flex flex-col items-center gap-4">
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/40"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
                Open WhatsApp
                <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
              </Link>

              {!userId && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  User ID belum terdeteksi otomatis. Tombol tetap aktif dengan placeholder `user_id`.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
