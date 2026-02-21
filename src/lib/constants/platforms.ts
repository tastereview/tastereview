import type { ComponentType } from 'react'
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
} from 'lucide-react'
import {
  GoogleIcon,
  TripAdvisorIcon,
  TheForkIcon,
  TikTokIcon,
  YelpIcon,
  TrustpilotIcon,
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
  },
  twitter: {
    key: 'twitter',
    name: 'X / Twitter',
    category: 'social',
    icon: Twitter,
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
  },
}

export const DEFAULT_PLATFORM_KEYS = [
  'google',
  'tripadvisor',
  'thefork',
  'instagram',
  'facebook',
  'tiktok',
]

export const EXTRA_PLATFORM_KEYS = [
  'yelp',
  'trustpilot',
  'youtube',
  'twitter',
  'linkedin',
]

export const ALL_PLATFORM_KEYS = [
  ...DEFAULT_PLATFORM_KEYS,
  ...EXTRA_PLATFORM_KEYS,
]
