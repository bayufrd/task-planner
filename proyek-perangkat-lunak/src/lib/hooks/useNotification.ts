'use client'

import { useSnackbar, VariantType } from 'notistack'

export function useNotification() {
  const { enqueueSnackbar } = useSnackbar()

  return {
    success: (message: string) =>
      enqueueSnackbar(message, {
        variant: 'success',
        preventDuplicate: true,
      }),
    error: (message: string) =>
      enqueueSnackbar(message, {
        variant: 'error',
        preventDuplicate: true,
      }),
    warning: (message: string) =>
      enqueueSnackbar(message, {
        variant: 'warning',
        preventDuplicate: true,
      }),
    info: (message: string) =>
      enqueueSnackbar(message, {
        variant: 'info',
        preventDuplicate: true,
      }),
  }
}
