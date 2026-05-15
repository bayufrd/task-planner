import axios from 'axios'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

export interface VerifyResult {
  success: boolean
  errorCodes?: string[]
}

/**
 * Verify Turnstile token with Cloudflare
 * @param token - The token from client-side Turnstile widget
 * @param secretKey - The secret key from Cloudflare dashboard
 * @param remoteIp - Optional IP address of the user (for rate limiting)
 */
export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  remoteIp?: string
): Promise<VerifyResult> {
  if (!token) {
    return { success: false, errorCodes: ['missing-token'] }
  }

  if (!secretKey) {
    console.error('[captcha] TURNSTILE_SECRET_KEY not configured')
    return { success: false, errorCodes: ['configuration-error'] }
  }

  try {
    const params: Record<string, string> = {
      secret: secretKey,
      response: token,
    }

    if (remoteIp) {
      params.remoteip = remoteIp
    }

    const response = await axios.post<TurnstileVerifyResponse>(
      TURNSTILE_VERIFY_URL,
      new URLSearchParams(params).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      }
    )

    if (response.data.success) {
      return { success: true }
    }

    return {
      success: false,
      errorCodes: response.data['error-codes'] || ['unknown-error'],
    }
  } catch (error) {
    console.error('[captcha] Verification request failed:', error)
    return {
      success: false,
      errorCodes: ['verification-request-failed'],
    }
  }
}

/**
 * Helper to get error message in Indonesian
 */
export function getErrorMessage(errorCodes?: string[]): string {
  if (!errorCodes || errorCodes.length === 0) {
    return 'Verifikasi CAPTCHA gagal'
  }

  const errorMessages: Record<string, string> = {
    'missing-input-secret': 'Kunci CAPTCHA tidak valid',
    'invalid-input-secret': 'Kunci CAPTCHA tidak valid',
    'missing-input-response': 'Token CAPTCHA tidak ditemukan',
    'invalid-input-response': 'Token CAPTCHA tidak valid',
    'invalid-widget-id': 'Widget CAPTCHA tidak valid',
    'invalid-parsed-secret': 'Format kunci CAPTCHA tidak valid',
    'bad-request': 'Request tidak valid',
    'timeout-or-duplicate': 'Token CAPTCHA sudah kadaluarsa, silakan coba lagi',
    'internal-error': 'Terjadi kesalahan server CAPTCHA',
    'configuration-error': 'Konfigurasi CAPTCHA belum selesai',
    'verification-request-failed': 'Gagal menghubungi server CAPTCHA',
    'unknown-error': 'Terjadi kesalahan yang tidak diketahui',
  }

  const messages = errorCodes
    .map(code => errorMessages[code] || code)
    .join(', ')

  return `Verifikasi CAPTCHA gagal: ${messages}`
}