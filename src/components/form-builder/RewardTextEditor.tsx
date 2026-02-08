'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Gift } from 'lucide-react'

interface RewardTextEditorProps {
  rewardText: string
  onSave: (text: string) => Promise<void>
  disabled?: boolean
}

export function RewardTextEditor({
  rewardText,
  onSave,
  disabled,
}: RewardTextEditorProps) {
  const [text, setText] = useState(rewardText)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setText(rewardText)
  }, [rewardText])

  useEffect(() => {
    setHasChanges(text !== rewardText)
  }, [text, rewardText])

  const handleSave = async () => {
    setIsSaving(true)
    await onSave(text)
    setIsSaving(false)
    setHasChanges(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Messaggio Premio</CardTitle>
            <CardDescription>
              Mostrato dopo il completamento del feedback
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rewardText">Testo</Label>
          <textarea
            id="rewardText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Es. Mostra questo schermo al cameriere per un caffè gratis!"
            className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={disabled || isSaving}
          />
          <p className="text-xs text-muted-foreground">
            Suggerimento: Offri un piccolo incentivo per incoraggiare i feedback
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {hasChanges && 'Modifiche non salvate'}
          </div>
          <Button
            onClick={handleSave}
            disabled={disabled || isSaving || !hasChanges}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              'Salva'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
