'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error')
  }, [error])

  return (
    <div className="max-w-md mx-auto text-center py-20 space-y-6">
      <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Errore nel caricamento</h2>
        <p className="text-muted-foreground text-sm">
          Non è stato possibile caricare i dati. Verifica la connessione e
          riprova.
        </p>
      </div>
      <Button onClick={reset}>Riprova</Button>
    </div>
  )
}
