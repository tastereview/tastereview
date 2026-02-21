import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Restaurant, Form, Table } from '@/types/database.types'
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

  // Get tables
  const { data: tablesData } = await supabase
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('created_at', { ascending: true })

  const tables = (tablesData || []) as Table[]

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const feedbackUrl = form
    ? `${appBaseUrl}/r/${restaurant.slug}/${form.id}`
    : null

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">QR Code</h1>
        <p className="text-muted-foreground mt-1">
          Genera e scarica i QR code per il tuo ristorante
        </p>
      </div>

      {feedbackUrl ? (
        <QRCodeClient
          baseUrl={feedbackUrl}
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          initialTables={tables}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nessun modulo trovato. Crea prima un modulo feedback.</p>
        </div>
      )}
    </div>
  )
}
