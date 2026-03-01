'use client'

import { useState } from 'react'
import type { Restaurant } from '@/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Store, Check } from 'lucide-react'

interface SettingsClientProps {
  restaurant: Restaurant
}

export function SettingsClient({ restaurant }: SettingsClientProps) {
  const supabase = createClient()

  const [name, setName] = useState(restaurant.name)
  const [isSavingInfo, setIsSavingInfo] = useState(false)
  const [savedInfo, setSavedInfo] = useState(false)

  const handleSaveInfo = async () => {
    if (!name.trim()) {
      toast.error('Il nome è obbligatorio')
      return
    }

    setIsSavingInfo(true)

    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ name: name.trim() })
        .eq('id', restaurant.id)

      if (error) throw error
      toast.success('Informazioni salvate')
      setSavedInfo(true)
      setTimeout(() => setSavedInfo(false), 2000)
    } catch {
      console.error('Failed to save info')
      toast.error('Errore nel salvare le informazioni')
    } finally {
      setIsSavingInfo(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Informazioni Ristorante</CardTitle>
          <Store className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <CardDescription>
          Dettagli base del tuo locale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome del ristorante</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Es. Trattoria da Mario"
            disabled={isSavingInfo}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL (slug)</Label>
          <Input
            id="slug"
            value={restaurant.slug}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Lo slug non può essere modificato dopo la creazione
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveInfo} disabled={isSavingInfo}>
            {isSavingInfo ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : savedInfo ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Salvato
              </>
            ) : (
              'Salva'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
