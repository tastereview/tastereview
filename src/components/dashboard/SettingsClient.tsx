'use client'

import { useState } from 'react'
import type { Restaurant } from '@/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Store, Share2 } from 'lucide-react'

interface SettingsClientProps {
  restaurant: Restaurant
}

export function SettingsClient({ restaurant }: SettingsClientProps) {
  const supabase = createClient()

  // Restaurant info state
  const [name, setName] = useState(restaurant.name)
  const [isSavingInfo, setIsSavingInfo] = useState(false)

  // Social links state
  const [googleUrl, setGoogleUrl] = useState(restaurant.google_business_url || '')
  const [instagram, setInstagram] = useState(restaurant.instagram_handle || '')
  const [tripadvisor, setTripadvisor] = useState(restaurant.tripadvisor_url || '')
  const [facebook, setFacebook] = useState(restaurant.facebook_url || '')
  const [isSavingSocial, setIsSavingSocial] = useState(false)

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
    } catch (error) {
      console.error('Failed to save info:', error)
      toast.error('Errore nel salvare le informazioni')
    } finally {
      setIsSavingInfo(false)
    }
  }

  const handleSaveSocial = async () => {
    setIsSavingSocial(true)

    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          google_business_url: googleUrl.trim() || null,
          instagram_handle: instagram.trim().replace('@', '') || null,
          tripadvisor_url: tripadvisor.trim() || null,
          facebook_url: facebook.trim() || null,
        })
        .eq('id', restaurant.id)

      if (error) throw error
      toast.success('Link social salvati')
    } catch (error) {
      console.error('Failed to save social links:', error)
      toast.error('Errore nel salvare i link')
    } finally {
      setIsSavingSocial(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Restaurant Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Informazioni Ristorante</CardTitle>
              <CardDescription>
                Dettagli base del tuo locale
              </CardDescription>
            </div>
          </div>
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
              ) : (
                'Salva'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Link Social</CardTitle>
              <CardDescription>
                Aggiungi i link per le recensioni (mostrati dopo feedback positivi)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google">Google Business</Label>
            <Input
              id="google"
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              placeholder="https://search.google.com/local/writereview?placeid=..."
              disabled={isSavingSocial}
            />
            <p className="text-xs text-muted-foreground">
              Trova il link nelle impostazioni del tuo profilo Google Business
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 rounded-l-md">
                @
              </span>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="tuoristorante"
                className="rounded-l-none"
                disabled={isSavingSocial}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tripadvisor">TripAdvisor</Label>
            <Input
              id="tripadvisor"
              value={tripadvisor}
              onChange={(e) => setTripadvisor(e.target.value)}
              placeholder="https://www.tripadvisor.it/Restaurant_Review-..."
              disabled={isSavingSocial}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://www.facebook.com/tuoristorante"
              disabled={isSavingSocial}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSocial} disabled={isSavingSocial}>
              {isSavingSocial ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                'Salva link'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
