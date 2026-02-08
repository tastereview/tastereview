'use client'

import { useState } from 'react'
import { FORM_TEMPLATES } from '@/types/forms.types'
import type { Question } from '@/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Loader2 } from 'lucide-react'

interface TemplateSelectorProps {
  onApply: (questions: Omit<Question, 'id' | 'form_id' | 'created_at'>[]) => Promise<void>
  disabled?: boolean
}

export function TemplateSelector({ onApply, disabled }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof FORM_TEMPLATES[0] | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!selectedTemplate) return

    setIsApplying(true)
    await onApply(selectedTemplate.questions)
    setIsApplying(false)
    setSelectedTemplate(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Template</CardTitle>
          <CardDescription>
            Scegli un template predefinito o personalizza il tuo modulo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {FORM_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                disabled={disabled}
                className="flex items-start gap-4 p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2 bg-primary/10 rounded-md">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Applica template</DialogTitle>
            <DialogDescription>
              Questo sostituirà tutte le domande esistenti con quelle del template
              &quot;{selectedTemplate?.name}&quot;. Sei sicuro?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedTemplate(null)}
              disabled={isApplying}
            >
              Annulla
            </Button>
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applicazione...
                </>
              ) : (
                'Applica template'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
