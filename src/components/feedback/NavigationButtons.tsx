'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2, Check } from 'lucide-react'

interface NavigationButtonsProps {
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  onBack: () => void
  onNext: () => void
}

export function NavigationButtons({
  isFirst,
  isLast,
  isSubmitting,
  onBack,
  onNext,
}: NavigationButtonsProps) {
  return (
    <div className="py-6 flex justify-between gap-4">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirst || isSubmitting}
        className={isFirst ? 'invisible' : ''}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Indietro
      </Button>

      <Button onClick={onNext} disabled={isSubmitting} className="min-w-[120px]">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isLast ? 'Invio...' : 'Salvo...'}
          </>
        ) : isLast ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Completa
          </>
        ) : (
          <>
            Avanti
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
