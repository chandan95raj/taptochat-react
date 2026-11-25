import { useState } from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Download, ExternalLink, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

function downloadQrPng(businessName) {
  return new Promise((resolve, reject) => {
    const svg = document.getElementById('whatsapp-qr')
    if (!svg) {
      reject(new Error('QR code is not available.'))
      return
    }
    const highResolutionSvg = svg.cloneNode(true)
    highResolutionSvg.setAttribute('width', '800')
    highResolutionSvg.setAttribute('height', '800')
    const source = new XMLSerializer().serializeToString(highResolutionSvg)
    const image = new Image()
    const objectUrl = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }))

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 1500
      const context = canvas.getContext('2d')
      if (!context) {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Could not create the QR image.'))
        return
      }
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.strokeStyle = '#e4eee8'
      context.lineWidth = 4
      context.strokeRect(28, 28, canvas.width - 56, canvas.height - 56)
      context.textAlign = 'center'
      context.fillStyle = '#173b2d'
      let titleSize = 54
      context.font = `600 ${titleSize}px Poppins, sans-serif`
      const title = businessName.trim() || 'WhatsApp Chat'
      while (context.measureText(title).width > 1020 && titleSize > 30) {
        titleSize -= 2
        context.font = `600 ${titleSize}px Poppins, sans-serif`
      }
      context.fillText(title, 600, 175)
      context.fillStyle = '#16845b'
      context.font = '600 30px Poppins, sans-serif'
      context.fillText('SCAN TO START A CHAT', 600, 255)
      context.drawImage(image, 200, 340, 800, 800)
      context.fillStyle = '#53675d'
      context.font = '400 26px Poppins, sans-serif'
      context.fillText('We would love to hear from you', 600, 1235)
      context.fillStyle = '#16845b'
      context.font = '600 21px Poppins, sans-serif'
      context.fillText('Open your camera and point it at the QR code', 600, 1290)
      context.fillStyle = '#718078'
      context.font = '500 18px Poppins, sans-serif'
      context.fillText('Made with TapToChat', 600, 1400)
      URL.revokeObjectURL(objectUrl)
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not export the QR image.'))
          return
        }
        const downloadUrl = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = downloadUrl
        anchor.download = 'taptochat-qr.png'
        anchor.click()
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
        resolve()
      }, 'image/png')
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not export the QR image.'))
    }
    image.src = objectUrl
  })
}

function LinkPreview({ link, message, phone, countryCode, businessName, onDownload }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const displayLink = link || 'https://wa.me/your-number'
  const previewMessage = message.trim() || 'No pre-filled message — the chat will open ready to type.'

  const handleDownload = async () => {
    if (!link || isDownloading) return
    setIsDownloading(true)
    try {
      await downloadQrPng(businessName)
      onDownload('Your print-ready QR poster has been downloaded.')
    } catch (error) {
      console.error('Unable to download QR code.', error)
      onDownload('Could not download the QR code. Please try again.', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Paper elevation={0} sx={{
      minWidth: 0,
      p: { xs: 2, sm: 3, md: 3.5 },
      border: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Stack direction="row" spacing={1.2} sx={{ mb: 2.5, alignItems: 'center' }}>
        <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', bgcolor: 'primary.light', color: 'primary.main', borderRadius: 3 }}>
          <QrCode size={21} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>Live link preview</Typography>
          <Typography variant="body2" color="text.secondary">Ready to share or print</Typography>
        </Box>
      </Stack>

      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: { xs: 232, sm: 258 }, flexGrow: 1, borderRadius: 3,
        bgcolor: mode => mode.palette.mode === 'light' ? '#f4f8f5' : '#202c26',
      }}>
        {link ? (
          <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 3, boxShadow: '0 8px 26px rgba(20,50,35,.08)' }}>
            <QRCodeSVG id="whatsapp-qr" value={link} size={188} level="H" includeMargin fgColor="#163d2e" />
          </Box>
        ) : (
          <Stack spacing={1.2} sx={{ alignItems: 'center', color: 'text.secondary', px: 2 }}>
            <Box sx={{ width: 114, height: 114, border: '2px dashed', borderColor: 'divider', borderRadius: 3, display: 'grid', placeItems: 'center', opacity: .7 }}>
              <QrCode size={42} />
            </Box>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>Enter a valid phone number to generate your QR code.</Typography>
          </Stack>
        )}
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Your shareable link
        </Typography>
        <Box sx={{
          mt: 0.5, px: 1.5, py: 1.2, borderRadius: 2.5, border: 1, borderColor: 'divider',
          bgcolor: 'background.default', wordBreak: 'break-all', fontSize: 12,
          lineHeight: 1.6, color: link ? 'primary.main' : 'text.secondary',
          fontFamily: 'monospace', minHeight: 44,
        }}>
          {displayLink}
        </Box>
      </Box>

      <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 2.5 }}>
        <Typography variant="caption" color="text.secondary">MESSAGE PREVIEW</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {previewMessage}
        </Typography>
        {phone && link && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            To: +{countryCode} {phone}
          </Typography>
        )}
      </Box>

      <Button
        variant="outlined"
        fullWidth
        disabled={!link || isDownloading}
        onClick={handleDownload}
        startIcon={<Download size={17} />}
        sx={{ mt: 2, py: 1.2 }}
      >
        {isDownloading ? 'Preparing QR poster…' : 'Download QR poster'}
      </Button>
      <Stack direction="row" spacing={0.7} sx={{ mt: 1.5, justifyContent: 'center', alignItems: 'center', color: 'text.secondary' }}>
        <ExternalLink size={13} />
        <Typography variant="caption">Print-ready PNG · 1200 × 1500</Typography>
      </Stack>
    </Paper>
  )
}

export default LinkPreview
