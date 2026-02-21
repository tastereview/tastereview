'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import type { Table } from '@/types/database.types'
import { TableManager } from './TableManager'
import { encodeTableId } from '@/lib/utils'

interface QRCodeClientProps {
  baseUrl: string
  restaurantId: string
  restaurantName: string
  initialTables: Table[]
}

function QRCodeCard({
  url,
  label,
  sublabel,
}: {
  url: string
  label: string
  sublabel?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#ffffff' },
      })
    }
  }, [url])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('URL copiato!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center py-6">
        <p className="font-medium text-sm mb-1">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground mb-3">{sublabel}</p>
        )}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <canvas ref={canvasRef} />
        </div>
        <div className="flex gap-2 mt-4 w-full max-w-xs">
          <Input value={url} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function QRCodeClient({
  baseUrl,
  restaurantId,
  restaurantName,
  initialTables,
}: QRCodeClientProps) {
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [isGenerating, setIsGenerating] = useState(false)

  const generalUrl = baseUrl

  const handleDownloadSinglePDF = useCallback(
    async (url: string, label: string) => {
      setIsGenerating(true)
      try {
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, url, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H',
        })

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const pageWidth = pdf.internal.pageSize.getWidth()

        pdf.setFontSize(24)
        pdf.setFont('helvetica', 'bold')
        const titleWidth = pdf.getTextWidth(restaurantName)
        pdf.text(restaurantName, (pageWidth - titleWidth) / 2, 40)

        if (label !== restaurantName) {
          pdf.setFontSize(18)
          pdf.setFont('helvetica', 'normal')
          const labelWidth = pdf.getTextWidth(label)
          pdf.text(label, (pageWidth - labelWidth) / 2, 52)
        }

        const qrDataUrl = canvas.toDataURL('image/png')
        const qrSize = 80
        const qrX = (pageWidth - qrSize) / 2
        const qrY = label !== restaurantName ? 60 : 50
        pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)

        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)
        const instruction = 'Scansiona per lasciare un feedback'
        const instrWidth = pdf.getTextWidth(instruction)
        pdf.text(instruction, (pageWidth - instrWidth) / 2, qrY + qrSize + 15)

        pdf.setFontSize(10)
        pdf.setTextColor(128, 128, 128)
        const urlWidth = pdf.getTextWidth(url)
        pdf.text(url, (pageWidth - urlWidth) / 2, qrY + qrSize + 25)

        const filename = `qr-${label.toLowerCase().replace(/\s+/g, '-')}.pdf`
        pdf.save(filename)
        toast.success('PDF scaricato!')
      } catch (error) {
        console.error('Failed to generate PDF:', error)
        toast.error('Errore nel generare il PDF')
      } finally {
        setIsGenerating(false)
      }
    },
    [restaurantName]
  )

  const handleDownloadAllPDF = useCallback(async () => {
    if (tables.length === 0) return

    setIsGenerating(true)
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()

      const allItems = [
        { label: 'QR Code Generale', url: generalUrl },
        ...tables.map((t) => ({
          label: t.name,
          url: `${baseUrl}?t=${encodeTableId(t.identifier)}`,
        })),
      ]

      for (let i = 0; i < allItems.length; i++) {
        if (i > 0) pdf.addPage()

        const item = allItems[i]
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, item.url, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H',
        })

        pdf.setFontSize(24)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 0, 0)
        const titleWidth = pdf.getTextWidth(restaurantName)
        pdf.text(restaurantName, (pageWidth - titleWidth) / 2, 40)

        pdf.setFontSize(18)
        pdf.setFont('helvetica', 'normal')
        const labelWidth = pdf.getTextWidth(item.label)
        pdf.text(item.label, (pageWidth - labelWidth) / 2, 52)

        const qrDataUrl = canvas.toDataURL('image/png')
        const qrSize = 80
        const qrX = (pageWidth - qrSize) / 2
        pdf.addImage(qrDataUrl, 'PNG', qrX, 60, qrSize, qrSize)

        pdf.setFontSize(16)
        const instruction = 'Scansiona per lasciare un feedback'
        const instrWidth = pdf.getTextWidth(instruction)
        pdf.text(instruction, (pageWidth - instrWidth) / 2, 155)

        pdf.setFontSize(10)
        pdf.setTextColor(128, 128, 128)
        const urlWidth = pdf.getTextWidth(item.url)
        pdf.text(item.url, (pageWidth - urlWidth) / 2, 165)
      }

      pdf.save(
        `qr-codes-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.pdf`
      )
      toast.success('PDF scaricato!')
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('Errore nel generare il PDF')
    } finally {
      setIsGenerating(false)
    }
  }, [tables, generalUrl, baseUrl, restaurantName])

  return (
    <div className="space-y-8">
      {/* General QR code */}
      <div>
        <h2 className="text-lg font-semibold mb-3">QR Code Generale</h2>
        <QRCodeCard url={generalUrl} label={restaurantName} />
        <div className="mt-3 flex justify-end">
          <Button
            onClick={() => handleDownloadSinglePDF(generalUrl, restaurantName)}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generazione...' : 'Scarica PDF'}
          </Button>
        </div>
      </div>

      {/* Table management */}
      <TableManager
        restaurantId={restaurantId}
        initialTables={initialTables}
        onTablesChange={setTables}
      />

      {/* Per-table QR codes */}
      {tables.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">QR Code per Tavolo</h2>
            <Button
              variant="outline"
              onClick={handleDownloadAllPDF}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generazione...' : 'Scarica tutti (PDF)'}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {tables.map((table) => {
              const tableUrl = `${baseUrl}?t=${encodeTableId(table.identifier)}`
              return (
                <div key={table.id}>
                  <QRCodeCard
                    url={tableUrl}
                    label={table.name}
                    sublabel={table.identifier}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadSinglePDF(tableUrl, table.name)}
                      disabled={isGenerating}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-2">Consigli</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>- Stampa il QR code in formato A5 o A6</li>
            <li>- Posiziona un QR code dedicato su ogni tavolo</li>
            <li>- Assicurati che sia ben illuminato e visibile</li>
            <li>- Testa sempre il QR code prima di stamparlo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
