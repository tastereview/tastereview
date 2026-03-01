'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled error')
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-3xl">!</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Qualcosa è andato storto</h2>
          <p className="text-muted-foreground">
            Si è verificato un errore imprevisto. Riprova o torna alla pagina
            principale.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Riprova</Button>
          <Button variant="outline" asChild>
            <a href="/">Torna alla home</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
