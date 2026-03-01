'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Restaurant } from '@/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Store, Share2, Plus, X, Check } from 'lucide-react'
import {
  PLATFORMS,
  DEFAULT_PLATFORM_KEYS,
  EXTRA_PLATFORM_KEYS,
} from '@/lib/constants/platforms'
import { GooglePlaceIdFinder } from './GooglePlaceIdFinder'

interface SettingsClientProps {
  restaurant: Restaurant
}

export function SettingsClient({ restaurant }: SettingsClientProps) {
  const supabase = createClient()

  // Restaurant info state
  const [name, setName] = useState(restaurant.name)
  const [isSavingInfo, setIsSavingInfo] = useState(false)
  const [savedInfo, setSavedInfo] = useState(false)

  // Social links state — initialize from social_links JSONB
  const existingLinks = (restaurant.social_links || {}) as Record<string, string>
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(existingLinks)
  const [isSavingSocial, setIsSavingSocial] = useState(false)
  const [savedSocial, setSavedSocial] = useState(false)

  // Track which platforms are visible (defaults + any that have values + any user added)
  const initialVisible = new Set([
    ...DEFAULT_PLATFORM_KEYS,
    ...Object.keys(existingLinks).filter((k) => existingLinks[k]),
  ])
  const [visiblePlatforms, setVisiblePlatforms] = useState<Set<string>>(initialVisible)

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
      // Clean values: trim, remove empty strings, strip @ from handle fields
      const cleaned: Record<string, string> = {}
      for (const [key, val] of Object.entries(socialLinks)) {
        const trimmed = val.trim()
        if (!trimmed) continue
        const platform = PLATFORMS[key]
        cleaned[key] = platform?.prefix ? trimmed.replace(/^@/, '') : trimmed
      }

      const { error } = await supabase
        .from('restaurants')
        .update({ social_links: cleaned })
        .eq('id', restaurant.id)

      if (error) throw error
      toast.success('Link social salvati')
      setSavedSocial(true)
      setTimeout(() => setSavedSocial(false), 2000)
    } catch (error) {
      console.error('Failed to save social links:', error)
      toast.error('Errore nel salvare i link')
    } finally {
      setIsSavingSocial(false)
    }
  }

  const updateLink = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }))
  }

  const addPlatform = (key: string) => {
    setVisiblePlatforms((prev) => new Set([...prev, key]))
  }

  const removePlatform = (key: string) => {
    setVisiblePlatforms((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
    setSocialLinks((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  // Platforms not yet visible that can be added
  const addablePlatforms = EXTRA_PLATFORM_KEYS.filter(
    (k) => !visiblePlatforms.has(k)
  )

  const reviewPlatforms = [...visiblePlatforms].filter(
    (k) => PLATFORMS[k]?.category === 'review'
  )
  const socialPlatforms = [...visiblePlatforms].filter(
    (k) => PLATFORMS[k]?.category === 'social'
  )

  const renderPlatformInput = (key: string, index: number) => {
    const platform = PLATFORMS[key]
    if (!platform) return null

    const isExtra = EXTRA_PLATFORM_KEYS.includes(key)
    const Icon = platform.icon

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor={`social-${key}`} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {platform.name}
          </Label>
          {isExtra && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => removePlatform(key)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        {key === 'google' ? (
          <GooglePlaceIdFinder
            value={socialLinks[key] || ''}
            onChange={(v) => updateLink(key, v)}
            disabled={isSavingSocial}
          />
        ) : platform.prefix ? (
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 rounded-l-md">
              {platform.prefix}
            </span>
            <Input
              id={`social-${key}`}
              value={socialLinks[key] || ''}
              onChange={(e) => updateLink(key, e.target.value)}
              placeholder={platform.placeholder}
              className="rounded-l-none"
              disabled={isSavingSocial}
            />
          </div>
        ) : (
          <Input
            id={`social-${key}`}
            value={socialLinks[key] || ''}
            onChange={(e) => updateLink(key, e.target.value)}
            placeholder={platform.placeholder}
            disabled={isSavingSocial}
          />
        )}
      </motion.div>
    )
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

      {/* Social Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Link e Recensioni</CardTitle>
              <CardDescription>
                Piattaforme di recensioni (mostrate dopo feedback positivi) e profili social
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Review platforms */}
          {reviewPlatforms.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Piattaforme di Recensioni
              </h3>
              {reviewPlatforms.map((key, i) => renderPlatformInput(key, i))}
            </div>
          )}

          {/* Social platforms */}
          {socialPlatforms.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Social
              </h3>
              {socialPlatforms.map((key, i) => renderPlatformInput(key, i))}
            </div>
          )}

          {/* Add platform button */}
          {addablePlatforms.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Aggiungi piattaforma:</p>
              <div className="flex flex-wrap gap-2">
                {addablePlatforms.map((key) => {
                  const platform = PLATFORMS[key]
                  const Icon = platform.icon
                  return (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addPlatform(key)}
                    >
                      <Icon className="h-3.5 w-3.5 mr-1.5" />
                      {platform.name}
                      <Plus className="h-3 w-3 ml-1" />
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSaveSocial} disabled={isSavingSocial}>
              {isSavingSocial ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : savedSocial ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Salvato
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
