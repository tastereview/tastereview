import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Restaurant, Form, Question } from '@/types/database.types'
import { FormBuilderClient } from '@/components/form-builder/FormBuilderClient'

export default async function FormBuilderPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurantData } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  const restaurant = restaurantData as Restaurant | null

  if (!restaurant) {
    redirect('/onboarding')
  }

  // Get the restaurant's form
  const { data: formData } = await supabase
    .from('forms')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .single()

  const form = formData as Form | null

  // Get questions for the form
  let questions: Question[] = []
  if (form) {
    const { data: questionsData } = await supabase
      .from('questions')
      .select('*')
      .eq('form_id', form.id)
      .order('order_index', { ascending: true })

    questions = (questionsData || []) as Question[]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Modulo Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Personalizza le domande del tuo modulo
        </p>
      </div>

      <FormBuilderClient
        form={form}
        initialQuestions={questions}
        restaurantId={restaurant.id}
      />
    </div>
  )
}
