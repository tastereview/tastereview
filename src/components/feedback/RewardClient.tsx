'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import type { Restaurant, Form, Sentiment } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Gift, ExternalLink } from 'lucide-react'

interface RewardClientProps {
  restaurant: Restaurant
  form: Form
}

const SENTIMENT_KEY = 'feedback_sentiment'

export function RewardClient({ restaurant, form }: RewardClientProps) {
  const [sentiment, setSentiment] = useState<Sentiment | null>(null)

  useEffect(() => {
    // Get sentiment from sessionStorage
    const savedSentiment = sessionStorage.getItem(SENTIMENT_KEY) as Sentiment | null
    setSentiment(savedSentiment)

    // Clear session data
    sessionStorage.removeItem('feedback_submission')
    sessionStorage.removeItem('feedback_answers')
    sessionStorage.removeItem(SENTIMENT_KEY)

    // Trigger confetti
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

  const showSocialButtons = sentiment === 'great'

  const socialLinks = [
    {
      name: 'Google',
      url: restaurant.google_business_url,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Instagram',
      url: restaurant.instagram_handle
        ? `https://instagram.com/${restaurant.instagram_handle}`
        : null,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    },
    {
      name: 'TripAdvisor',
      url: restaurant.tripadvisor_url,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      name: 'Facebook',
      url: restaurant.facebook_url,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
  ].filter((link) => link.url)

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

        {showSocialButtons && socialLinks.length > 0 && (
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Ti è piaciuta l&apos;esperienza? Condividi la tua opinione!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  asChild
                  className={`${link.color} text-white`}
                >
                  <a href={link.url!} target="_blank" rel="noopener noreferrer">
                    {link.name}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {!showSocialButtons && restaurant.instagram_handle && (
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Seguici sui social!
            </p>
            <Button asChild variant="outline">
              <a
                href={`https://instagram.com/${restaurant.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Seguici su Instagram
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
