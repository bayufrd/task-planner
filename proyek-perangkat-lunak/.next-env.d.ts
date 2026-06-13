// Enable faster builds and optimizations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string
    }
  }
}

export {}
