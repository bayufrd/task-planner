import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const backendToken = req.cookies.get('backendAuthToken')?.value
  const nextAuthToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = Boolean(backendToken || nextAuthToken)

  if (isAuthenticated) {
    return NextResponse.next()
  }

  const signInUrl = new URL('/auth/signin', req.url)
  signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search)

  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    // Protected routes only
    '/dashboard/:path*',
    '/calendar/:path*',
    '/settings/:path*',
    '/api/tasks/:path*',
    '/api/reminders/:path*',
    '/api/google-calendar/:path*',
  ],
}
