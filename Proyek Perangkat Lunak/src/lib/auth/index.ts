/**
 * NextAuth Configuration
 * Shared configuration for authentication
 */

import type { NextAuthOptions, DefaultSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      emailVerified?: Date | null
      locale?: string
      hd?: string
      accessToken?: string
    } & DefaultSession['user']
  }
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials in environment variables')
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        return token
      }

      // Check if token needs refresh
      if (token.expiresAt && Date.now() >= (token.expiresAt as number) * 1000) {
        console.log('🔄 Token expired, attempting refresh...')
        
        // If no refresh token, token is invalid and needs re-authentication
        if (!token.refreshToken) {
          console.warn('⚠️ No refresh token available. User needs to re-authenticate.')
          return token
        }

        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken as string,
            }).toString(),
          })

          const refreshedTokens = await response.json()

          if (!response.ok) {
            console.error('❌ Token refresh failed:', refreshedTokens)
            throw new Error('Token refresh failed')
          }

          console.log('✅ Token refreshed successfully')
          return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000) + (refreshedTokens.expires_in || 3600),
            refreshToken: refreshedTokens.refresh_token || token.refreshToken,
          }
        } catch (error) {
          console.error('❌ Failed to refresh token:', error)
          return token
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        ;(session.user as any).accessToken = token.accessToken
        ;(session.user as any).emailVerified = token.email_verified
        ;(session.user as any).locale = token.locale
        ;(session.user as any).hd = token.hd
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Ensure we only redirect to allowed URLs
      if (url.startsWith('/')) {
        // Relative URL - prepend baseUrl
        return `${baseUrl}${url}`
      } else if (new URL(url).origin === baseUrl) {
        // Same origin URL - allow
        return url
      }
      // Default fallback to baseUrl
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
