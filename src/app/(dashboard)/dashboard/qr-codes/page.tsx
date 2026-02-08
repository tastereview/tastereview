import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Restaurant, Form } from '@/types/database.types'
import { QRCodeClient } from '@/components/dashboard/QRCodeClient'

export default async function QRCodesPage() {
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

  // Get the restaurant's form
  const { data: formData } = await supabase
    .from('forms')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .single()

  const form = formData as Form | null

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const feedbackUrl = form
    ? `${baseUrl}/r/${restaurant.slug}/${form.id}`
    : null

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">QR Code</h1>
        <p className="text-muted-foreground mt-1">
          Genera e scarica il QR code per il tuo ristorante
        </p>
      </div>

      {feedbackUrl ? (
        <QRCodeClient
          url={feedbackUrl}
          restaurantName={restaurant.name}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nessun modulo trovato. Crea prima un modulo feedback.</p>
        </div>
      )}
    </div>
  )
}
