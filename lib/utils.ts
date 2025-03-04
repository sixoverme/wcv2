import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function getInitials(name: string): string {
  if (!name) return "?"

  const parts = name.split(" ")
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export const redirectToLogin = (redirectTo?: string) => {
  const url = new URL('/login', window.location.origin)
  if (redirectTo) {
    url.searchParams.set('redirectTo', redirectTo)
  }
  window.location.href = url.toString()
}

export const redirectToHome = () => {
  window.location.href = '/'
}

export const getRedirectUrl = (fallback = '/') => {
  if (typeof window === 'undefined') return fallback
  
  const params = new URLSearchParams(window.location.search)
  return params.get('redirectTo') || fallback
}

export const formatError = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return 'An unexpected error occurred'
}

