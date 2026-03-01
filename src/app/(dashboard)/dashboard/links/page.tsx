import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Link',
  robots: { index: false, follow: false },
}
import { redirect } from 'next/navigation'
import type { Restaurant } from '@/types/database.types'
import { LinksClient } from '@/components/dashboard/LinksClient'

export default async function LinksPage() {
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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Link</h1>
        <p className="text-muted-foreground mt-1">
          Gestisci i link alle piattaforme di recensioni e ai profili social
        </p>
      </div>

      <LinksClient restaurant={restaurant} />
    </div>
  )
}
