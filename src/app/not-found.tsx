import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-7xl font-bold text-muted-foreground/30">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Pagina non trovata</h2>
          <p className="text-muted-foreground">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Torna alla home</Link>
        </Button>
      </div>
    </div>
  )
}
