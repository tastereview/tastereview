'use client'

import type { Question } from '@/types/database.types'
import type { AnswerValue } from '@/types/forms.types'
import { FieldRenderer } from './FieldRenderer'

interface QuestionScreenProps {
  question: Question
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
  error?: string | null
}

export function QuestionScreen({
  question,
  value,
  onChange,
  error,
}: QuestionScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{question.label}</h2>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
        {question.is_required && (
          <span className="text-xs text-muted-foreground">* Obbligatoria</span>
        )}
      </div>

      <FieldRenderer
        question={question}
        value={value}
        onChange={onChange}
        error={error}
      />
    </div>
  )
}
