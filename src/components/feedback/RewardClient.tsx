'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import type { Restaurant, Form, Sentiment } from '@/types/database.types'
import { Card, CardContent } from '@/components/ui/card'
import { Gift, ExternalLink } from 'lucide-react'
import { PLATFORMS } from '@/lib/constants/platforms'

interface RewardClientProps {
  restaurant: Restaurant
  form: Form
}

const SENTIMENT_KEY = 'feedback_sentiment'

export function RewardClient({ restaurant, form }: RewardClientProps) {
  // Read sentiment synchronously before first render to avoid React Strict Mode
  // double-effect clearing sessionStorage before state is set
  const [sentiment] = useState<Sentiment | null>(() => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(SENTIMENT_KEY) as Sentiment | null
  })

  useEffect(() => {
    sessionStorage.removeItem('feedback_submission')
    sessionStorage.removeItem('feedback_answers')
    sessionStorage.removeItem(SENTIMENT_KEY)

    const duration = 3 * 1000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  const links = (restaurant.social_links || {}) as Record<string, string>
  const showReviewButtons = sentiment === 'great'

  // Build review and social link arrays from social_links JSONB
  const reviewLinks = Object.entries(links)
    .filter(([key, val]) => val && PLATFORMS[key]?.category === 'review')
    .map(([key, val]) => ({
      platform: PLATFORMS[key],
      url: PLATFORMS[key].buildUrl(val),
    }))

  const socialFollowLinks = Object.entries(links)
    .filter(([key, val]) => val && PLATFORMS[key]?.category === 'social')
    .map(([key, val]) => ({
      platform: PLATFORMS[key],
      url: PLATFORMS[key].buildUrl(val),
    }))

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <Gift className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold">Grazie!</h1>

          <p className="text-muted-foreground">
            Il tuo feedback è stato inviato con successo.
          </p>
        </div>

        {form.reward_text && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-lg font-medium">{form.reward_text}</p>
            </CardContent>
          </Card>
        )}

        {showReviewButtons && reviewLinks.length > 0 && (
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Ti è piaciuta l&apos;esperienza? Condividi la tua opinione!
            </p>
            <div className="flex flex-col gap-3 w-full">
              {reviewLinks.map(({ platform, url }) => {
                const Icon = platform.icon
                return (
                  <a
                    key={platform.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${platform.buttonColor} text-white w-full rounded-xl p-4 flex items-center gap-4 transition-transform active:scale-[0.98]`}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg shrink-0 ${platform.key === 'google' ? 'bg-white' : 'bg-white/20'}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-base">Recensisci su {platform.name}</p>
                      <p className="text-sm text-white/80">Lascia una recensione</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-white/60 shrink-0" />
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {socialFollowLinks.length > 0 && (
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Seguici!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {socialFollowLinks.map(({ platform, url }) => {
                const Icon = platform.icon
                return (
                  <a
                    key={platform.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${platform.buttonColor} text-white rounded-xl px-5 py-3 flex items-center gap-2.5 transition-transform active:scale-[0.98]`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{platform.name}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
