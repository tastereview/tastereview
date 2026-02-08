'use client'

import type { Question, QuestionType } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Smile,
  Star,
  AlignLeft,
  CheckSquare,
  CircleDot,
} from 'lucide-react'
import { QUESTION_TYPE_META } from '@/types/forms.types'

interface AddQuestionMenuProps {
  onAdd: (question: Omit<Question, 'id' | 'created_at'>) => Promise<void>
  disabled?: boolean
  formId: string
}

const typeIcons: Record<QuestionType, typeof Smile> = {
  sentiment: Smile,
  star_rating: Star,
  open_text: AlignLeft,
  multiple_choice: CheckSquare,
  single_choice: CircleDot,
}

const defaultLabels: Record<QuestionType, string> = {
  sentiment: 'Come è stata la tua esperienza?',
  star_rating: 'Come valuti questo aspetto?',
  open_text: 'Hai commenti o suggerimenti?',
  multiple_choice: 'Seleziona le opzioni che preferisci',
  single_choice: 'Seleziona un\'opzione',
}

const defaultOptions = [
  { id: '1', label: 'Opzione 1' },
  { id: '2', label: 'Opzione 2' },
  { id: '3', label: 'Opzione 3' },
]

export function AddQuestionMenu({ onAdd, disabled, formId }: AddQuestionMenuProps) {
  const handleAdd = async (type: QuestionType) => {
    const hasOptions = type === 'multiple_choice' || type === 'single_choice'

    await onAdd({
      form_id: formId,
      type,
      label: defaultLabels[type],
      description: null,
      is_required: type !== 'open_text',
      options: hasOptions ? defaultOptions : null,
      order_index: 0, // Will be set correctly in the parent
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(Object.keys(QUESTION_TYPE_META) as QuestionType[]).map((type) => {
          const Icon = typeIcons[type]
          const meta = QUESTION_TYPE_META[type]
          return (
            <DropdownMenuItem
              key={type}
              onClick={() => handleAdd(type)}
              className="flex items-start gap-3 p-3"
            >
              <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">{meta.label}</p>
                <p className="text-xs text-muted-foreground">{meta.description}</p>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
