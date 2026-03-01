'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, X } from 'lucide-react'

interface TrialExpirationBannerProps {
  daysRemaining: number
}

export function TrialExpirationBanner({ daysRemaining }: TrialExpirationBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const isExpired = daysRemaining <= 0
  const message =
    isExpired
      ? 'La tua prova gratuita è scaduta.'
      : daysRemaining === 1
        ? 'La tua prova gratuita scade domani.'
        : `La tua prova gratuita scade tra ${daysRemaining} giorni.`

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium ${
        isExpired
          ? 'bg-red-50 text-red-800 border-b border-red-200'
          : 'bg-amber-50 text-amber-800 border-b border-amber-200'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          {message}{' '}
          <Link
            href="/dashboard/billing"
            className={`underline underline-offset-2 font-semibold ${
              isExpired ? 'text-red-900' : 'text-amber-900'
            }`}
          >
            Abbonati ora
          </Link>
        </span>
      </div>
      {!isExpired && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-md p-1 hover:bg-amber-100 transition-colors"
          aria-label="Chiudi"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
