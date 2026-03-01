'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Gift, Check } from 'lucide-react'

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
  const [saved, setSaved] = useState(false)

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
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Messaggio Premio</CardTitle>
          <Gift className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <CardDescription>
          Mostrato dopo il completamento del feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rewardText">Testo</Label>
          <textarea
            id="rewardText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Es. Mostra questo schermo al cameriere per un caffè gratis!"
            className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            disabled={disabled || isSaving}
          />
          <p className="text-xs text-muted-foreground">
            Suggerimento: Offri un piccolo incentivo per incoraggiare i feedback
          </p>
        </div>

        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {hasChanges && (
              <motion.div
                key="unsaved"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-amber-600"
              >
                Modifiche non salvate
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            onClick={handleSave}
            disabled={disabled || isSaving || !hasChanges}
            className="ml-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Salvato
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
