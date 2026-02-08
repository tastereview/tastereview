'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { FORM_TEMPLATES } from '@/types/forms.types'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .slice(0, 50) // Limit length
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [restaurantName, setRestaurantName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Check if user already has a restaurant
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (restaurant) {
        router.push('/dashboard')
        return
      }

      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [supabase, router])

  // Auto-generate slug from restaurant name
  useEffect(() => {
    if (!slugManuallyEdited && restaurantName) {
      setSlug(generateSlug(restaurantName))
    }
  }, [restaurantName, slugManuallyEdited])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true)
    setSlug(generateSlug(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!restaurantName.trim()) {
      setError('Inserisci il nome del ristorante')
      return
    }

    if (!slug.trim()) {
      setError('Inserisci un URL valido')
      return
    }

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Check if slug is already taken
      const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('slug', slug)
        .single()

      if (existingRestaurant) {
        setError('Questo URL è già in uso. Scegline un altro.')
        setIsLoading(false)
        return
      }

      // Create restaurant
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          owner_id: user.id,
          name: restaurantName.trim(),
          slug: slug,
        })
        .select()
        .single()

      if (restaurantError) {
        console.error('Restaurant creation error:', restaurantError)
        setError('Errore nella creazione del ristorante. Riprova.')
        setIsLoading(false)
        return
      }

      // Create default form with "Quick & Simple" template
      const template = FORM_TEMPLATES[0] // Quick & Simple
      const { data: form, error: formError } = await supabase
        .from('forms')
        .insert({
          restaurant_id: restaurant.id,
          name: 'Modulo Feedback',
          is_active: true,
          reward_text: 'Grazie per il tuo feedback! Mostra questo schermo al cameriere.',
        })
        .select()
        .single()

      if (formError) {
        console.error('Form creation error:', formError)
        // Continue anyway, user can create form later
      } else {
        // Create default questions
        const questions = template.questions.map((q, index) => ({
          id: nanoid(),
          form_id: form.id,
          type: q.type,
          label: q.label,
          description: q.description,
          is_required: q.is_required,
          options: q.options,
          order_index: index,
        }))

        await supabase.from('questions').insert(questions)
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Onboarding error:', err)
      setError('Si è verificato un errore. Riprova.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Configura il tuo ristorante</CardTitle>
          <CardDescription>
            Inserisci le informazioni del tuo locale per iniziare
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome del ristorante</Label>
              <Input
                id="restaurantName"
                type="text"
                placeholder="Es. Trattoria da Mario"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL del tuo modulo feedback</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  /r/
                </span>
                <Input
                  id="slug"
                  type="text"
                  placeholder="trattoria-da-mario"
                  value={slug}
                  onChange={handleSlugChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Questo sarà l&apos;indirizzo del QR code per i tuoi clienti
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creazione in corso...
                </>
              ) : (
                'Inizia'
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
