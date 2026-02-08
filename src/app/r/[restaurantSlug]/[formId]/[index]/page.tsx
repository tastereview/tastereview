import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import type { Restaurant, Form, Question } from '@/types/database.types'
import { QuestionPageClient } from '@/components/feedback/QuestionPageClient'

interface Props {
  params: Promise<{
    restaurantSlug: string
    formId: string
    index: string
  }>
}

export default async function QuestionPage({ params }: Props) {
  const { restaurantSlug, formId, index } = await params
  const questionIndex = parseInt(index, 10)
  const supabase = await createClient()

  // Validate index
  if (isNaN(questionIndex) || questionIndex < 1) {
    redirect(`/r/${restaurantSlug}/${formId}/1`)
  }

  // Fetch restaurant
  const { data: restaurantData } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', restaurantSlug)
    .single()

  const restaurant = restaurantData as Restaurant | null

  if (!restaurant) {
    notFound()
  }

  // Fetch form
  const { data: formData } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)
    .single()

  const form = formData as Form | null

  if (!form) {
    notFound()
  }

  // Fetch questions
  const { data: questionsData } = await supabase
    .from('questions')
    .select('*')
    .eq('form_id', form.id)
    .order('order_index', { ascending: true })

  const questions = (questionsData || []) as Question[]

  if (questions.length === 0) {
    notFound()
  }

  // Check if index is valid
  if (questionIndex > questions.length) {
    redirect(`/r/${restaurantSlug}/${formId}/reward`)
  }

  const currentQuestion = questions[questionIndex - 1]
  const totalQuestions = questions.length
  const isFirst = questionIndex === 1
  const isLast = questionIndex === totalQuestions

  return (
    <QuestionPageClient
      question={currentQuestion}
      questionIndex={questionIndex}
      totalQuestions={totalQuestions}
      isFirst={isFirst}
      isLast={isLast}
      formId={formId}
      restaurantSlug={restaurantSlug}
    />
  )
}
