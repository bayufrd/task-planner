import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'

export const middleware = withAuth(
  function middleware(req: NextRequest) {
    // Middleware logic here if needed
    return null
  },
  {
    callbacks: {
      authorized: ({ token, req }) => !!token || !!req.cookies.get('backendAuthToken')?.value,
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
