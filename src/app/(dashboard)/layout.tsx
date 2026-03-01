import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TrialExpirationBanner } from '@/components/dashboard/TrialExpirationBanner'
import type { Restaurant } from '@/types/database.types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  const restaurant = data as Restaurant | null

  if (!restaurant) {
    redirect('/onboarding')
  }

  // Compute trial days remaining
  let trialDaysRemaining: number | null = null
  if (restaurant.subscription_status === 'trialing' && restaurant.trial_ends_at) {
    const now = new Date()
    const trialEnd = new Date(restaurant.trial_ends_at)
    trialDaysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const showTrialBanner = trialDaysRemaining !== null && trialDaysRemaining <= 3

  return (
    <div className="min-h-screen bg-background">
      <Sidebar restaurantName={restaurant.name} />
      <main className="lg:pl-64 pt-16 lg:pt-0">
        {showTrialBanner && trialDaysRemaining !== null && (
          <TrialExpirationBanner daysRemaining={trialDaysRemaining} />
        )}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
