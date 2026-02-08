'use client'

import type { Question } from '@/types/database.types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { QuestionItem } from './QuestionItem'
import { Inbox } from 'lucide-react'

interface QuestionListProps {
  questions: Question[]
  onReorder: (questions: Question[]) => void
  onEdit: (question: Question) => void
  onDelete: (questionId: string) => void
  disabled?: boolean
}

export function QuestionList({
  questions,
  onReorder,
  onEdit,
  onDelete,
  disabled,
}: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id)
      const newIndex = questions.findIndex((q) => q.id === over.id)

      const newQuestions = arrayMove(questions, oldIndex, newIndex)
      onReorder(newQuestions)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nessuna domanda</h3>
        <p className="text-muted-foreground max-w-md">
          Aggiungi domande al tuo modulo usando il pulsante qui sopra,
          oppure scegli un template predefinito.
        </p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              onEdit={() => onEdit(question)}
              onDelete={() => onDelete(question.id)}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
