import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'

export const middleware = withAuth(
  function middleware(req: NextRequest) {
    // Middleware logic here if needed
    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

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
