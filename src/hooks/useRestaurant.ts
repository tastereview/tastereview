'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Restaurant } from '@/types/database.types'
import { useAuth } from './useAuth'

export function useRestaurant() {
  const supabase = createClient()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (isAuthLoading) return

    if (!user) {
      setRestaurant(null)
      setIsLoading(false)
      return
    }

    const fetchRestaurant = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('owner_id', user.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No restaurant found
            setRestaurant(null)
          } else {
            throw error
          }
        } else {
          setRestaurant(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch restaurant'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurant()
  }, [user, isAuthLoading, supabase])

  const refetch = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setRestaurant(data ?? null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch restaurant'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    restaurant,
    isLoading: isLoading || isAuthLoading,
    error,
    refetch,
  }
}
