'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Table } from '@/types/database.types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, UtensilsCrossed } from 'lucide-react'

interface TableManagerProps {
  restaurantId: string
  initialTables: Table[]
  onTablesChange: (tables: Table[]) => void
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function TableManager({
  restaurantId,
  initialTables,
  onTablesChange,
}: TableManagerProps) {
  const supabase = createClient()
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [newTableName, setNewTableName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const updateTables = (updated: Table[]) => {
    setTables(updated)
    onTablesChange(updated)
  }

  const handleAdd = async () => {
    const name = newTableName.trim()
    if (!name) return

    const identifier = slugify(name)
    if (!identifier) {
      toast.error('Nome tavolo non valido')
      return
    }

    if (tables.some((t) => t.identifier === identifier)) {
      toast.error('Esiste già un tavolo con questo identificativo')
      return
    }

    setIsAdding(true)

    try {
      const { data, error } = await supabase
        .from('tables')
        .insert({ restaurant_id: restaurantId, name, identifier })
        .select()
        .single()

      if (error) throw error
      updateTables([...tables, data as Table])
      setNewTableName('')
      toast.success('Tavolo aggiunto')
    } catch (error) {
      console.error('Failed to add table:', error)
      toast.error('Errore nell\'aggiungere il tavolo')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)

    try {
      const { error } = await supabase.from('tables').delete().eq('id', id)
      if (error) throw error
      updateTables(tables.filter((t) => t.id !== id))
      toast.success('Tavolo eliminato')
    } catch (error) {
      console.error('Failed to delete table:', error)
      toast.error('Errore nell\'eliminare il tavolo')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Gestione Tavoli</CardTitle>
            <CardDescription>
              Crea tavoli per generare QR code dedicati e tracciare i feedback per tavolo
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add table */}
        <div className="flex gap-2">
          <Input
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="Es. Tavolo 1, Terrazza, Sala VIP..."
            disabled={isAdding}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
          />
          <Button onClick={handleAdd} disabled={isAdding || !newTableName.trim()}>
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Table list */}
        {tables.length > 0 ? (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {tables.map((table) => (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{table.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => handleDelete(table.id)}
                      disabled={deletingId === table.id}
                    >
                      {deletingId === table.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground text-center py-4"
          >
            Nessun tavolo creato. Aggiungi un tavolo per generare QR code dedicati.
          </motion.p>
        )}
      </CardContent>
    </Card>
  )
}
