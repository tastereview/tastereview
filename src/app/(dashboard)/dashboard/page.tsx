import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Restaurant, Submission } from '@/types/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FeedbackList } from '@/components/dashboard/FeedbackList'
import { ScoreRing } from '@/components/dashboard/ScoreRing'
import { Frown, Meh, Smile } from 'lucide-react'

function SentimentBar({ great, ok, bad, total }: { great: number; ok: number; bad: number; total: number }) {
  if (total === 0) return null

  const pGreat = (great / total) * 100
  const pOk = (ok / total) * 100
  const pBad = (bad / total) * 100

  return (
    <div className="space-y-2 w-full">
      <div className="flex h-2.5 rounded-full overflow-hidden bg-muted/30">
        {pGreat > 0 && (
          <div className="bg-green-500 transition-all" style={{ width: `${pGreat}%` }} />
        )}
        {pOk > 0 && (
          <div className="bg-yellow-500 transition-all" style={{ width: `${pOk}%` }} />
        )}
        {pBad > 0 && (
          <div className="bg-red-500 transition-all" style={{ width: `${pBad}%` }} />
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          {Math.round(pGreat)}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
          {Math.round(pOk)}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          {Math.round(pBad)}%
        </span>
      </div>
    </div>
  )
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Adesso'
  if (diffMins < 60) return `${diffMins} min fa`
  if (diffHours < 24) return `${diffHours} ore fa`
  if (diffDays === 1) return 'Ieri'
  if (diffDays < 7) return `${diffDays} giorni fa`

  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

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

  const { data: formData } = await supabase
    .from('forms')
    .select('id')
    .eq('restaurant_id', restaurant.id)
    .single()

  let submissions: Submission[] = []
  let stats = { total: 0, great: 0, ok: 0, bad: 0 }

  if (formData) {
    const { data: submissionsData } = await supabase
      .from('submissions')
      .select('*')
      .eq('form_id', formData.id)
      .not('completed_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(200)

    submissions = (submissionsData || []) as Submission[]

    stats.total = submissions.length
    submissions.forEach((s) => {
      if (s.overall_sentiment === 'great') stats.great++
      else if (s.overall_sentiment === 'ok') stats.ok++
      else if (s.overall_sentiment === 'bad') stats.bad++
    })
  }

  const score =
    stats.total > 0
      ? Math.round((stats.great * 100 + stats.ok * 50) / stats.total)
      : 0

  // Stats for the "Totale" card
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000)

  const todayCount = submissions.filter(
    (s) => new Date(s.created_at) >= todayStart
  ).length
  const weekCount = submissions.filter(
    (s) => new Date(s.created_at) >= weekStart
  ).length
  const lastFeedback = submissions.length > 0 ? submissions[0].created_at : null

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Visualizza e gestisci i feedback dei tuoi clienti
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Overall Score */}
        <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Soddisfazione complessiva
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 pt-2 pb-6">
            {stats.total > 0 ? (
              <>
                <ScoreRing score={score} />
                <SentimentBar
                  great={stats.great}
                  ok={stats.ok}
                  bad={stats.bad}
                  total={stats.total}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                Il punteggio apparirà dopo il primo feedback
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats summary */}
        <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Riepilogo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-3.5">
                <p className="text-xs text-muted-foreground mb-1">Totali</p>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3.5">
                <p className="text-xs text-muted-foreground mb-1">Oggi</p>
                <span className="text-2xl font-bold">{todayCount}</span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3.5">
                <p className="text-xs text-muted-foreground mb-1">Ultimi 7 giorni</p>
                <span className="text-2xl font-bold">{weekCount}</span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3.5">
                <p className="text-xs text-muted-foreground mb-1">Ultimo</p>
                <span className="text-lg font-semibold">
                  {lastFeedback ? formatRelativeDate(lastFeedback) : '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment breakdown */}
        <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center gap-4 pt-2 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                <Smile className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Ottimo</p>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.great}</span>
            </div>
            <div className="border-t" />
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                <Meh className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Ok</p>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{stats.ok}</span>
            </div>
            <div className="border-t" />
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <Frown className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Negativo</p>
              </div>
              <span className="text-2xl font-bold text-red-600">{stats.bad}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <FeedbackList submissions={submissions} formId={formData?.id} />
    </div>
  )
}
