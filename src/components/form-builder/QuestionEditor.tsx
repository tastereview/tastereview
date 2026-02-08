'use client'

import { useState, useEffect } from 'react'
import type { Question } from '@/types/database.types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2, Plus, X } from 'lucide-react'

interface QuestionEditorProps {
  question: Question | null
  onSave: (question: Question) => Promise<void>
  onClose: () => void
}

interface QuestionOption {
  id: string
  label: string
}

export function QuestionEditor({ question, onSave, onClose }: QuestionEditorProps) {
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [isRequired, setIsRequired] = useState(true)
  const [options, setOptions] = useState<QuestionOption[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasOptions = question?.type === 'multiple_choice' || question?.type === 'single_choice'

  useEffect(() => {
    if (question) {
      setLabel(question.label)
      setDescription(question.description || '')
      setIsRequired(question.is_required)
      setOptions(
        (question.options as unknown as QuestionOption[]) || []
      )
      setError(null)
    }
  }, [question])

  const handleSave = async () => {
    if (!question) return

    if (!label.trim()) {
      setError('Inserisci il testo della domanda')
      return
    }

    if (hasOptions && options.length < 2) {
      setError('Aggiungi almeno 2 opzioni')
      return
    }

    setIsSaving(true)
    setError(null)

    await onSave({
      ...question,
      label: label.trim(),
      description: description.trim() || null,
      is_required: isRequired,
      options: hasOptions ? (options as unknown as Question['options']) : null,
    })

    setIsSaving(false)
  }

  const addOption = () => {
    setOptions([
      ...options,
      { id: crypto.randomUUID(), label: '' },
    ])
  }

  const updateOption = (id: string, value: string) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, label: value } : opt))
    )
  }

  const removeOption = (id: string) => {
    setOptions(options.filter((opt) => opt.id !== id))
  }

  return (
    <Dialog open={!!question} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifica domanda</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="label">Testo della domanda</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Es. Come valuti il servizio?"
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione (opzionale)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Testo di aiuto sotto la domanda"
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Obbligatoria</Label>
              <p className="text-sm text-muted-foreground">
                L&apos;utente deve rispondere per continuare
              </p>
            </div>
            <Switch
              checked={isRequired}
              onCheckedChange={setIsRequired}
              disabled={isSaving}
            />
          </div>

          {hasOptions && (
            <div className="space-y-3">
              <Label>Opzioni</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Input
                      value={option.label}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      placeholder={`Opzione ${index + 1}`}
                      disabled={isSaving}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                      disabled={isSaving || options.length <= 2}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={isSaving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi opzione
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              'Salva'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
