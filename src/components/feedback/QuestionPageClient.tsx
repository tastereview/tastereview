'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { Question, Sentiment } from '@/types/database.types'
import type { AnswerValue } from '@/types/forms.types'
import { ProgressBar } from './ProgressBar'
import { QuestionScreen } from './QuestionScreen'
import { NavigationButtons } from './NavigationButtons'
import { createClient } from '@/lib/supabase/client'

interface QuestionPageClientProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  isFirst: boolean
  isLast: boolean
  formId: string
  restaurantSlug: string
}

const SUBMISSION_KEY = 'feedback_submission'
const ANSWERS_KEY = 'feedback_answers'
const SENTIMENT_KEY = 'feedback_sentiment'

export function QuestionPageClient({
  question,
  questionIndex,
  totalQuestions,
  isFirst,
  isLast,
  formId,
  restaurantSlug,
}: QuestionPageClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [answer, setAnswer] = useState<AnswerValue | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  // Load saved answer from sessionStorage
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem(ANSWERS_KEY)
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers)
      if (answers[question.id]) {
        setAnswer(answers[question.id])
      } else {
        setAnswer(undefined)
      }
    } else {
      setAnswer(undefined)
    }
  }, [question.id])

  const saveAnswer = async () => {
    // Get or create submission
    let submissionId: string | null = sessionStorage.getItem(SUBMISSION_KEY)

    if (!submissionId) {
      const { data, error } = await supabase
        .from('submissions')
        .insert({ form_id: formId })
        .select('id')
        .single()

      if (error) throw error
      submissionId = data.id as string
      sessionStorage.setItem(SUBMISSION_KEY, submissionId)
    }

    // Save answer to database
    if (answer !== undefined) {
      // Check if answer already exists
      const { data: existingAnswer } = await supabase
        .from('answers')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('question_id', question.id)
        .single()

      if (existingAnswer) {
        await supabase
          .from('answers')
          .update({ value: answer })
          .eq('id', existingAnswer.id)
      } else {
        await supabase
          .from('answers')
          .insert({
            submission_id: submissionId,
            question_id: question.id,
            value: answer,
          })
      }

      // Track sentiment if this is a sentiment question
      if (question.type === 'sentiment') {
        sessionStorage.setItem(SENTIMENT_KEY, answer as string)
        await supabase
          .from('submissions')
          .update({ overall_sentiment: answer as Sentiment })
          .eq('id', submissionId)
      }
    }

    // Save to sessionStorage for local state
    const savedAnswers = JSON.parse(sessionStorage.getItem(ANSWERS_KEY) || '{}')
    savedAnswers[question.id] = answer
    sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(savedAnswers))

    return submissionId
  }

  const handleNext = async () => {
    setError(null)

    // Validate required
    if (question.is_required && (answer === undefined || answer === '')) {
      setError('Questa domanda è obbligatoria')
      return
    }

    setIsSubmitting(true)
    setDirection('forward')

    try {
      const submissionId = await saveAnswer()

      if (isLast) {
        // Mark submission as complete
        await supabase
          .from('submissions')
          .update({ completed_at: new Date().toISOString() })
          .eq('id', submissionId)

        router.push(`/r/${restaurantSlug}/${formId}/reward`)
      } else {
        router.push(`/r/${restaurantSlug}/${formId}/${questionIndex + 1}`)
      }
    } catch (err) {
      console.error('Failed to save answer:', err)
      setError('Errore nel salvare la risposta. Riprova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (isFirst) return
    setDirection('backward')
    router.push(`/r/${restaurantSlug}/${formId}/${questionIndex - 1}`)
  }

  const variants = {
    enter: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? -50 : 50,
      opacity: 0,
    }),
  }

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4">
      <ProgressBar current={questionIndex} total={totalQuestions} />

      <div className="flex-1 flex items-center justify-center py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <QuestionScreen
              question={question}
              value={answer}
              onChange={setAnswer}
              error={error}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <NavigationButtons
        isFirst={isFirst}
        isLast={isLast}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  )
}
