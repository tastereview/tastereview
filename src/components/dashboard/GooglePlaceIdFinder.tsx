'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDown, ExternalLink } from 'lucide-react'

interface GooglePlaceIdFinderProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function GooglePlaceIdFinder({
  value,
  onChange,
  disabled,
}: GooglePlaceIdFinderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ChIJxxxxxxxxxxxxxxxxx"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground p-0 h-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        Come trovare il Place ID?
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1 inline-flex"
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-muted/50 rounded-md p-4 space-y-3 text-sm">
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  Vai al{' '}
                  <a
                    href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline inline-flex items-center gap-1"
                  >
                    Place ID Finder di Google
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>Cerca il nome del tuo ristorante nella mappa</li>
                <li>Clicca sul risultato per vedere il Place ID</li>
                <li>Copia il Place ID e incollalo qui sopra</li>
              </ol>
              <p className="text-xs text-muted-foreground">
                Il Place ID inizia con &quot;ChIJ&quot; ed è una stringa alfanumerica
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
