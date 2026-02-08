'use client'

import { useState } from 'react'
import type { Submission } from '@/types/database.types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Frown, Meh, Smile, ChevronRight, Inbox } from 'lucide-react'
import { FeedbackDetailDialog } from './FeedbackDetailDialog'

interface FeedbackListProps {
  submissions: Submission[]
  formId?: string
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

export function FeedbackList({ submissions, formId }: FeedbackListProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nessun feedback ancora</h3>
          <p className="text-muted-foreground max-w-md">
            Quando i tuoi clienti inizieranno a lasciare feedback tramite il QR code,
            li vedrai apparire qui.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {submissions.map((submission) => (
              <button
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex-shrink-0">
                  <SentimentIcon sentiment={submission.overall_sentiment} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    {sentimentLabel(submission.overall_sentiment)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(submission.created_at)}
                  </p>
                </div>
                {submission.table_identifier && (
                  <span className="text-sm text-muted-foreground">
                    Tavolo {submission.table_identifier}
                  </span>
                )}
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <FeedbackDetailDialog
        submission={selectedSubmission}
        formId={formId}
        onClose={() => setSelectedSubmission(null)}
      />
    </>
  )
}
