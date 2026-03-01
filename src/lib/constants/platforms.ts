import type { ComponentType } from 'react'
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from 'lucide-react'
import {
  GoogleIcon,
  TripAdvisorIcon,
  TheForkIcon,
  TikTokIcon,
  YelpIcon,
  TrustpilotIcon,
  XIcon,
} from '@/components/icons/PlatformIcons'

export type PlatformCategory = 'review' | 'social'

export interface Platform {
  key: string
  name: string
  category: PlatformCategory
  icon: ComponentType<{ className?: string }>
  placeholder: string
  prefix?: string
  valueLabel: string
  buildUrl: (value: string) => string
  buttonColor: string
  /** Hostnames the URL must match (substring check). Only for URL-based platforms. */
  allowedDomains?: string[]
}

export const PLATFORMS: Record<string, Platform> = {
  google: {
    key: 'google',
    name: 'Google',
    category: 'review',
    icon: GoogleIcon,
    placeholder: 'ChIJxxxxxxxxxxxxxxxxx',
    valueLabel: 'Place ID',
    buildUrl: (v) =>
      `https://search.google.com/local/writereview?placeid=${v}`,
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  tripadvisor: {
    key: 'tripadvisor',
    name: 'TripAdvisor',
    category: 'review',
    icon: TripAdvisorIcon,
    placeholder: 'https://www.tripadvisor.it/Restaurant_Review-...',
    valueLabel: 'URL completo',
    buildUrl: (v) => v,
    buttonColor: 'bg-green-600 hover:bg-green-700',
    allowedDomains: ['tripadvisor.'],
  },
  thefork: {
    key: 'thefork',
    name: 'TheFork',
    category: 'review',
    icon: TheForkIcon,
    placeholder: 'https://www.thefork.it/ristorante/...',
    valueLabel: 'URL completo',
    buildUrl: (v) => v,
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
    allowedDomains: ['thefork.', 'lafourchette.'],
  },
  yelp: {
    key: 'yelp',
    name: 'Yelp',
    category: 'review',
    icon: YelpIcon,
    placeholder: 'https://www.yelp.it/biz/...',
    valueLabel: 'URL completo',
    buildUrl: (v) => v,
    buttonColor: 'bg-red-600 hover:bg-red-700',
    allowedDomains: ['yelp.'],
  },
  trustpilot: {
    key: 'trustpilot',
    name: 'Trustpilot',
    category: 'review',
    icon: TrustpilotIcon,
    placeholder: 'https://it.trustpilot.com/review/...',
    valueLabel: 'URL completo',
    buildUrl: (v) => v,
    buttonColor: 'bg-green-500 hover:bg-green-600',
    allowedDomains: ['trustpilot.'],
  },
  instagram: {
    key: 'instagram',
    name: 'Instagram',
    category: 'social',
    icon: Instagram,
    placeholder: 'tuoristorante',
    prefix: '@',
    valueLabel: 'Username',
    buildUrl: (v) => `https://instagram.com/${v}`,
    buttonColor:
      'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
  },
  facebook: {
    key: 'facebook',
    name: 'Facebook',
    category: 'social',
    icon: Facebook,
    placeholder: 'https://www.facebook.com/tuoristorante',
    valueLabel: 'URL completo',
    buildUrl: (v) => v,
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
    allowedDomains: ['facebook.com', 'fb.com'],
  },
  tiktok: {
    key: 'tiktok',
    name: 'TikTok',
    category: 'social',
    icon: TikTokIcon,
    placeholder: 'tuoristorante',
    prefix: '@',
    valueLabel: 'Username',
    buildUrl: (v) => `https://tiktok.com/@${v}`,
    buttonColor: 'bg-black hover:bg-gray-800',
  },
  youtube: {
    key: 'youtube',
    name: 'YouTube',
    category: 'social',
    icon: Youtube,
    placeholder: 'https://youtube.com/@tuoristorante',
    valueLabel: 'URL completo',
    buildUrl: (v) => v,
    buttonColor: 'bg-red-600 hover:bg-red-700',
    allowedDomains: ['youtube.com', 'youtu.be'],
  },
  twitter: {
    key: 'twitter',
    name: 'X / Twitter',
    category: 'social',
    icon: XIcon,
    placeholder: 'tuoristorante',
    prefix: '@',
    valueLabel: 'Username',
    buildUrl: (v) => `https://x.com/${v}`,
    buttonColor: 'bg-black hover:bg-gray-800',
  },
  linkedin: {
    key: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    icon: Linkedin,
    placeholder: 'https://linkedin.com/company/tuoristorante',
    valueLabel: 'URL completo',
    buildUrl: (v) => v,
    buttonColor: 'bg-blue-700 hover:bg-blue-800',
    allowedDomains: ['linkedin.com'],
  },
}

export const INITIAL_PLATFORM_KEYS = [
  'google',
  'tripadvisor',
  'thefork',
  'instagram',
  'facebook',
  'tiktok',
]

export const ALL_PLATFORM_KEYS = [
  ...INITIAL_PLATFORM_KEYS,
  'yelp',
  'trustpilot',
  'youtube',
  'twitter',
  'linkedin',
]

/**
 * Normalizes a URL value: auto-prepends https:// if missing.
 */
function normalizeUrl(value: string): string {
  if (!/^https?:\/\//i.test(value)) {
    return `https://${value}`
  }
  return value
}

/**
 * Validates and cleans a single platform value.
 * Returns { ok: true, value } with the cleaned value, or { ok: false, error } with an Italian error message.
 */
export function validatePlatformValue(
  key: string,
  rawValue: string
): { ok: true; value: string } | { ok: false; error: string } {
  const platform = PLATFORMS[key]
  if (!platform) return { ok: false, error: 'Piattaforma sconosciuta' }

  const trimmed = rawValue.trim()
  if (!trimmed) return { ok: true, value: '' }

  // Google Place ID
  if (key === 'google') {
    // Place IDs: start with "ChIJ", followed by base64url chars, typically 27 chars
    if (!/^ChIJ[A-Za-z0-9_-]{20,50}$/.test(trimmed)) {
      return {
        ok: false,
        error: `${platform.name}: Place ID non valido. Deve iniziare con "ChIJ" seguito da caratteri alfanumerici (es. ChIJN1t_tDeuEmsRUsoyG83frY4)`,
      }
    }
    return { ok: true, value: trimmed }
  }

  // Handle-based platforms (instagram, tiktok, twitter)
  if (platform.prefix) {
    const handle = trimmed.replace(/^@/, '')
    if (!/^[a-zA-Z0-9._]{1,50}$/.test(handle)) {
      return {
        ok: false,
        error: `${platform.name}: username non valido (solo lettere, numeri, punti e underscore)`,
      }
    }
    return { ok: true, value: handle }
  }

  // URL-based platforms — normalize and validate
  const normalized = normalizeUrl(trimmed)

  let url: URL
  try {
    url = new URL(normalized)
  } catch {
    return { ok: false, error: `${platform.name}: URL non valido` }
  }

  if (!['https:', 'http:'].includes(url.protocol)) {
    return {
      ok: false,
      error: `${platform.name}: l'URL deve iniziare con https://`,
    }
  }

  // Check domain matches the platform
  if (platform.allowedDomains) {
    const hostname = url.hostname.toLowerCase()
    const matches = platform.allowedDomains.some((domain) =>
      hostname.includes(domain)
    )
    if (!matches) {
      const expected = platform.allowedDomains
        .map((d) => d.replace(/\.$/, ''))
        .join(', ')
      return {
        ok: false,
        error: `${platform.name}: l'URL deve essere di ${expected}`,
      }
    }
  }

  return { ok: true, value: normalized }
}
