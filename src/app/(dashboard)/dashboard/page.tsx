import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Restaurant, Submission } from '@/types/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FeedbackList } from '@/components/dashboard/FeedbackList'
import { Frown, Meh, Smile, MessageSquare } from 'lucide-react'

export default async function DashboardPage() {
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
    .select('id')
    .eq('restaurant_id', restaurant.id)
    .single()

  // Get submissions with answers
  let submissions: Submission[] = []
  let stats = { total: 0, great: 0, ok: 0, bad: 0 }

  if (formData) {
    const { data: submissionsData } = await supabase
      .from('submissions')
      .select('*')
      .eq('form_id', formData.id)
      .not('completed_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50)

    submissions = (submissionsData || []) as Submission[]

    // Calculate stats
    stats.total = submissions.length
    submissions.forEach((s) => {
      if (s.overall_sentiment === 'great') stats.great++
      else if (s.overall_sentiment === 'ok') stats.ok++
      else if (s.overall_sentiment === 'bad') stats.bad++
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Visualizza e gestisci i feedback dei tuoi clienti
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totale
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ottimo
            </CardTitle>
            <Smile className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.great}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ok
            </CardTitle>
            <Meh className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.ok}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Negativo
            </CardTitle>
            <Frown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.bad}</div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <FeedbackList submissions={submissions} formId={formData?.id} />
    </div>
  )
}
