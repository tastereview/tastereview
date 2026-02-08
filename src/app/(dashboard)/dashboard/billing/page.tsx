import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Restaurant } from '@/types/database.types'
import { BillingClient } from '@/components/dashboard/BillingClient'

export default async function BillingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurantData } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  const restaurant = restaurantData as Restaurant | null

  if (!restaurant) {
    redirect('/onboarding')
  }

  // Calculate trial days remaining
  let trialDaysRemaining = 0
  if (restaurant.trial_ends_at) {
    const trialEnd = new Date(restaurant.trial_ends_at)
    const now = new Date()
    const diffTime = trialEnd.getTime() - now.getTime()
    trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Abbonamento</h1>
        <p className="text-muted-foreground mt-1">
          Gestisci il tuo abbonamento
        </p>
      </div>

      <BillingClient
        restaurant={restaurant}
        trialDaysRemaining={trialDaysRemaining}
      />
    </div>
  )
}
