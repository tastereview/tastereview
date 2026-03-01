'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2, Check, ShieldCheck } from 'lucide-react'

interface NavigationButtonsProps {
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  isVerifying?: boolean
  isVerified?: boolean
  onBack: () => void
  onNext: () => void
}

export function NavigationButtons({
  isFirst,
  isLast,
  isSubmitting,
  isVerifying = false,
  isVerified = false,
  onBack,
  onNext,
}: NavigationButtonsProps) {
  const showVerificationStatus = isVerifying || isVerified

  return (
    <div className="py-6 space-y-3">
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isFirst || isSubmitting}
          className={isFirst ? 'invisible' : ''}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Indietro
        </Button>

        <Button onClick={onNext} disabled={isSubmitting || isVerifying} className="min-w-[120px]">
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

      <AnimatePresence>
        {showVerificationStatus && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-2 text-sm"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Controllando che tu sia umano...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span className="text-green-600">Verifica completata</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
