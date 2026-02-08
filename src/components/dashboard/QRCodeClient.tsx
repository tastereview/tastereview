'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface QRCodeClientProps {
  url: string
  restaurantName: string
}

export function QRCodeClient({ url, restaurantName }: QRCodeClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
    }
  }, [url])

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('URL copiato!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)

    try {
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Add restaurant name
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      const titleWidth = pdf.getTextWidth(restaurantName)
      pdf.text(restaurantName, (pageWidth - titleWidth) / 2, 40)

      // Add QR code
      const qrDataUrl = canvasRef.current.toDataURL('image/png')
      const qrSize = 80 // mm
      const qrX = (pageWidth - qrSize) / 2
      const qrY = 60
      pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)

      // Add instruction text
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'normal')
      const instructionText = 'Scansiona per lasciare un feedback'
      const instructionWidth = pdf.getTextWidth(instructionText)
      pdf.text(instructionText, (pageWidth - instructionWidth) / 2, qrY + qrSize + 15)

      // Add URL (smaller)
      pdf.setFontSize(10)
      pdf.setTextColor(128, 128, 128)
      const urlWidth = pdf.getTextWidth(url)
      pdf.text(url, (pageWidth - urlWidth) / 2, qrY + qrSize + 25)

      // Download
      pdf.save(`qr-code-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.pdf`)
      toast.success('PDF scaricato!')
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('Errore nel generare il PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* QR Code Preview */}
      <Card>
        <CardContent className="flex flex-col items-center py-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <canvas ref={canvasRef} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Scansiona per testare il modulo
          </p>
        </CardContent>
      </Card>

      {/* URL */}
      <Card>
        <CardContent className="py-4">
          <label className="text-sm font-medium mb-2 block">
            URL del modulo feedback
          </label>
          <div className="flex gap-2">
            <Input
              value={url}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyUrl}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Download */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Scarica QR Code</h3>
              <p className="text-sm text-muted-foreground">
                PDF pronto per la stampa con istruzioni
              </p>
            </div>
            <Button onClick={handleDownloadPDF} disabled={isGenerating}>
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generazione...' : 'Scarica PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-2">Consigli</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Stampa il QR code in formato A5 o A6</li>
            <li>• Posizionalo sul tavolo o vicino alla cassa</li>
            <li>• Assicurati che sia ben illuminato e visibile</li>
            <li>• Testa sempre il QR code prima di stamparlo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
