'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Restaurant } from '@/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle, AlertCircle, Clock, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface BillingClientProps {
  restaurant: Restaurant
  trialDaysRemaining: number
}

const statusLabels: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  trialing: { label: 'In prova', color: 'text-blue-600', icon: Clock },
  active: { label: 'Attivo', color: 'text-green-600', icon: CheckCircle },
  canceled: { label: 'Cancellato', color: 'text-red-600', icon: AlertCircle },
  past_due: { label: 'Pagamento in ritardo', color: 'text-orange-600', icon: AlertCircle },
  incomplete: { label: 'Incompleto', color: 'text-yellow-600', icon: AlertCircle },
}

export function BillingClient({ restaurant, trialDaysRemaining }: BillingClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isManaging, setIsManaging] = useState(false)

  const hasActiveSubscription = restaurant.subscription_status === 'active'
  const isTrialing = restaurant.subscription_status === 'trialing'
  const isTrialExpired = isTrialing && trialDaysRemaining <= 0

  const status = isTrialExpired
    ? { label: 'Prova scaduta', color: 'text-red-600', icon: AlertCircle as typeof CheckCircle }
    : statusLabels[restaurant.subscription_status] || statusLabels.trialing
  const StatusIcon = status.icon

  const handleSubscribe = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId: restaurant.id }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch {
      console.error('Checkout error')
      toast.error('Errore nel creare la sessione di pagamento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!restaurant.stripe_customer_id) {
      toast.error('Nessun abbonamento trovato')
      return
    }

    setIsManaging(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId: restaurant.id }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url
    } catch {
      console.error('Portal error')
      toast.error('Errore nel aprire il portale')
    } finally {
      setIsManaging(false)
    }
  }

  const getInactiveAlert = () => {
    if (hasActiveSubscription) return null
    if (isTrialing && trialDaysRemaining > 0) return null

    if (isTrialing && trialDaysRemaining <= 0) {
      return {
        message: 'La tua prova gratuita è scaduta. Abbonati per continuare a usare 5stelle.',
        bgColor: 'bg-red-50 border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
      }
    }
    if (restaurant.subscription_status === 'canceled') {
      return {
        message: 'Il tuo abbonamento è stato cancellato. Riattivalo per accedere a tutte le funzionalità.',
        bgColor: 'bg-amber-50 border-amber-200',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600',
      }
    }
    if (restaurant.subscription_status === 'past_due') {
      return {
        message: 'Il pagamento non è andato a buon fine. Aggiorna il metodo di pagamento.',
        bgColor: 'bg-red-50 border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
      }
    }
    if (restaurant.subscription_status === 'incomplete') {
      return {
        message: 'Il pagamento non è stato completato. Completa la procedura per attivare l\'abbonamento.',
        bgColor: 'bg-amber-50 border-amber-200',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600',
      }
    }
    return null
  }

  const inactiveAlert = getInactiveAlert()

  return (
    <div className="space-y-6">
      {inactiveAlert && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${inactiveAlert.bgColor}`}>
          <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${inactiveAlert.iconColor}`} />
          <p className={`text-sm font-medium ${inactiveAlert.textColor}`}>
            {inactiveAlert.message}
          </p>
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Piano Attuale</CardTitle>
              <CardDescription>
                Il tuo abbonamento 5stelle
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${status.color}`} />
                <span className={`font-medium ${status.color}`}>{status.label}</span>
              </div>
              {isTrialing && trialDaysRemaining > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {trialDaysRemaining} giorni rimanenti
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">€39</p>
              <p className="text-sm text-muted-foreground">/mese</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="py-6">
          {!hasActiveSubscription ? (
            <div className="text-center space-y-4">
              <div>
                <h3 className="font-medium text-lg">Abbonati a 5stelle</h3>
                <p className="text-muted-foreground text-sm">
                  {isTrialing && trialDaysRemaining > 0
                    ? 'Attiva il tuo abbonamento per continuare dopo la prova'
                    : 'Riattiva il tuo abbonamento per accedere a tutte le funzionalità'
                  }
                </p>
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.015, 1],
                  boxShadow: [
                    '0 0 10px 2px rgba(251,191,36,0.2)',
                    '0 0 25px 8px rgba(245,158,11,0.4)',
                    '0 0 10px 2px rgba(251,191,36,0.2)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-xl inline-block"
              >
                <div className="relative rounded-xl p-[3px] overflow-hidden">
                  <div className="absolute inset-0 z-0 rounded-xl bg-amber-400" />
                  <motion.div
                    className="absolute inset-[-50%] z-[1]"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 0%, transparent 70%, rgba(255,255,255,0.85) 78%, #fde68a 82%, transparent 90%, transparent 100%)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    size="lg"
                    className="relative z-10 rounded-[9px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Caricamento...
                      </>
                    ) : (
                      'Abbonati ora'
                    )}
                  </Button>
                </div>
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Pagamento sicuro con Stripe. Cancella quando vuoi.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Gestisci abbonamento</h3>
                <p className="text-sm text-muted-foreground">
                  Modifica metodo di pagamento o cancella
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isManaging}
              >
                {isManaging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Caricamento...
                  </>
                ) : (
                  'Gestisci'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-3">Cosa include</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Modulo feedback personalizzabile</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>QR code generato automaticamente</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Dashboard feedback in tempo reale</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Redirect automatico alle recensioni</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Supporto via email</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
