'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Submission, Sentiment } from '@/types/database.types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Frown,
  Meh,
  Smile,
  ChevronRight,
  Inbox,
  CalendarDays,
  Filter,
  X,
} from 'lucide-react'
import { FeedbackDetailDialog } from './FeedbackDetailDialog'

interface FeedbackListProps {
  submissions: Submission[]
  formId?: string
  tableNames?: Record<string, string>
}

type PeriodFilter = 'all' | 'today' | 'week' | 'month'
type SentimentFilter = 'all' | Sentiment

const PERIOD_LABELS: Record<PeriodFilter, string> = {
  all: 'Tutto',
  today: 'Oggi',
  week: 'Ultimi 7 giorni',
  month: 'Ultimi 30 giorni',
}

const SENTIMENT_LABELS: Record<SentimentFilter, string> = {
  all: 'Tutti',
  great: 'Ottimo',
  ok: 'Ok',
  bad: 'Negativo',
}

function SentimentIcon({ sentiment }: { sentiment: string | null }) {
  switch (sentiment) {
    case 'great':
      return <Smile className="h-5 w-5 text-green-500" />
    case 'ok':
      return <Meh className="h-5 w-5 text-yellow-500" />
    case 'bad':
      return <Frown className="h-5 w-5 text-red-500" />
    default:
      return null
  }
}

function formatTime(dateString: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

function formatDateHeading(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return 'Oggi'
  if (diffDays === 1) return 'Ieri'

  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  }).format(date)
}

function sentimentLabel(sentiment: string | null): string {
  switch (sentiment) {
    case 'great':
      return 'Ottimo'
    case 'ok':
      return 'Ok'
    case 'bad':
      return 'Negativo'
    default:
      return '-'
  }
}

function getDateKey(dateString: string): string {
  const d = new Date(dateString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function FeedbackList({ submissions, formId, tableNames = {} }: FeedbackListProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null)
  const [period, setPeriod] = useState<PeriodFilter>('all')
  const [sentiment, setSentiment] = useState<SentimentFilter>('all')

  const filtered = useMemo(() => {
    const now = new Date()
    const todayStart = startOfDay(now)

    return submissions.filter((s) => {
      // Period filter
      if (period !== 'all') {
        const created = new Date(s.created_at)
        if (period === 'today' && created < todayStart) return false
        if (
          period === 'week' &&
          created < new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000)
        )
          return false
        if (
          period === 'month' &&
          created < new Date(todayStart.getTime() - 29 * 24 * 60 * 60 * 1000)
        )
          return false
      }

      // Sentiment filter
      if (sentiment !== 'all' && s.overall_sentiment !== sentiment) return false

      return true
    })
  }, [submissions, period, sentiment])

  // Group by date
  const grouped = useMemo(() => {
    const groups: { key: string; label: string; items: Submission[] }[] = []
    const map = new Map<string, Submission[]>()

    for (const s of filtered) {
      const key = getDateKey(s.created_at)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }

    for (const [key, items] of map) {
      groups.push({
        key,
        label: formatDateHeading(items[0].created_at),
        items,
      })
    }

    return groups
  }, [filtered])

  const hasActiveFilters = period !== 'all' || sentiment !== 'all'

  if (submissions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">
              Nessun feedback ancora
            </h3>
            <p className="text-muted-foreground max-w-md">
              Quando i tuoi clienti inizieranno a lasciare feedback tramite il QR
              code, li vedrai apparire qui.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={period !== 'all' ? 'default' : 'outline'}
              size="sm"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              {PERIOD_LABELS[period]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(Object.keys(PERIOD_LABELS) as PeriodFilter[]).map((key) => (
              <DropdownMenuItem key={key} onClick={() => setPeriod(key)}>
                {PERIOD_LABELS[key]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={sentiment !== 'all' ? 'default' : 'outline'}
              size="sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              {SENTIMENT_LABELS[sentiment]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(Object.keys(SENTIMENT_LABELS) as SentimentFilter[]).map(
              (key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSentiment(key)}
                >
                  <span className="flex items-center gap-2">
                    {key !== 'all' && <SentimentIcon sentiment={key} />}
                    {SENTIMENT_LABELS[key]}
                  </span>
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPeriod('all')
                  setSentiment('all')
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Rimuovi filtri
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} feedback
        </span>
      </div>

      {/* Grouped list */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">
                  Nessun feedback trovato con i filtri selezionati.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={`${period}-${sentiment}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {grouped.map((group, groupIdx) => (
              <div key={group.key}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                  {group.label}
                </h3>
                <Card className="py-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {group.items.map((submission, i) => (
                        <motion.button
                          key={submission.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.25,
                            delay: (groupIdx * group.items.length + i) * 0.03,
                            ease: 'easeOut',
                          }}
                          onClick={() => setSelectedSubmission(submission)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex-shrink-0">
                            <SentimentIcon
                              sentiment={submission.overall_sentiment}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {sentimentLabel(submission.overall_sentiment)}
                              </p>
                              {submission.table_identifier && (
                                <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                  {tableNames[submission.table_identifier] || submission.table_identifier}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(submission.created_at)}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackDetailDialog
        submission={selectedSubmission}
        formId={formId}
        tableNames={tableNames}
        onClose={() => setSelectedSubmission(null)}
      />
    </>
  )
}
