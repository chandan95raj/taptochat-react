import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Snackbar,
  Stack,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import Header from './components/Header.jsx'
import PhoneForm from './components/PhoneForm.jsx'
import LinkPreview from './components/LinkPreview.jsx'
import RecentHistory from './components/RecentHistory.jsx'

const HISTORY_KEY = 'taptochat-recent'

function readHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    return {
      entries: Array.isArray(stored) ? stored.slice(0, 6) : [],
      error: '',
    }
  } catch (error) {
    console.error('Unable to read recent chats from local storage.', error)
    return { entries: [], error: 'Recent chats could not be loaded from this browser.' }
  }
}

function App() {
  const [mode, setMode] = useState('light')
  const [countryCode, setCountryCode] = useState('91')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [initialHistory] = useState(readHistory)
  const [history, setHistory] = useState(initialHistory.entries)
  const [notice, setNotice] = useState(() => ({
    open: Boolean(initialHistory.error),
    text: initialHistory.error,
    severity: initialHistory.error ? 'error' : 'success',
  }))

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#16845b', dark: '#106b49', light: '#e8f5ee' },
      background: {
        default: mode === 'light' ? '#f5f8f6' : '#101916',
        paper: mode === 'light' ? '#ffffff' : '#19231f',
      },
      text: {
        primary: mode === 'light' ? '#17231e' : '#edf5f0',
        secondary: mode === 'light' ? '#718078' : '#a7b6ad',
      },
      divider: mode === 'light' ? '#e8eeea' : '#2c3932',
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 11, minHeight: 44 } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 11 } } },
      MuiPaper: { styleOverrides: { rounded: { borderRadius: 18 } } },
    },
  }), [mode])

  const maxPhoneDigits = countryCode === '91' ? 10 : 15 - countryCode.length
  const isValid = (countryCode === '91' && /^\d{10}$/.test(phone))
    || (countryCode !== '91' && /^\d{7,15}$/.test(phone) && phone.length <= maxPhoneDigits)
  const waLink = useMemo(() => {
    if (!isValid) return ''
    const base = `https://wa.me/${countryCode}${phone}`
    return message.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base
  }, [countryCode, phone, message, isValid])

  const updateHistory = (nextHistory) => {
    setHistory(nextHistory)
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
      return true
    } catch (error) {
      console.error('Unable to save recent chats to local storage.', error)
      setNotice({ open: true, text: 'Recent chats could not be saved in this browser.', severity: 'error' })
      return false
    }
  }

  const showNotice = (text, severity = 'success') => setNotice({ open: true, text, severity })

  const rememberNumber = () => {
    if (!isValid) return
    const entry = {
      countryCode,
      phone,
      message: message.trim(),
      savedAt: Date.now(),
    }
    const nextHistory = [
      entry,
      ...history.filter((item) => item.countryCode !== countryCode || item.phone !== phone),
    ].slice(0, 6)
    return updateHistory(nextHistory)
  }

  const openWhatsApp = () => {
    if (!waLink) return
    rememberNumber()
    window.open(waLink, '_blank', 'noopener,noreferrer')
  }

  const copyLink = async () => {
    if (!waLink) return
    try {
      await navigator.clipboard.writeText(waLink)
      const historySaved = rememberNumber()
      showNotice(historySaved
        ? 'Your WhatsApp link is copied and ready to share.'
        : 'Your link was copied, but recent chats could not be saved.', historySaved ? 'success' : 'error')
    } catch (error) {
      console.error('Unable to copy the WhatsApp link.', error)
      showNotice('Could not copy the link. Please check your browser permissions.', 'error')
    }
  }

  const useHistoryEntry = (entry) => {
    setCountryCode(entry.countryCode)
    setPhone(entry.phone)
    setMessage(entry.message || '')
  }

  const clearHistory = () => updateHistory([])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 3, md: 5 } }}>
        <Header mode={mode} onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')} />

        <Container maxWidth={false} sx={{ px: { xs: 1.5, sm: 3, lg: 5 }, pt: { xs: 4, md: 6 } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'primary.main', mb: 1.5 }}>
            <Sparkles size={16} />
            <Box component="span" sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.15, textTransform: 'uppercase' }}>
              The simplest way to start a conversation
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'end', gap: 2, mb: 4 }}>
            <Box>
              <Box component="h1" sx={{
                m: 0,
                fontSize: { xs: 32, sm: 42, md: 50 },
                lineHeight: 1.17,
                letterSpacing: { xs: -1.1, md: -1.8 },
                fontWeight: 700,
                maxWidth: 1000,
              }}>
                Make every first message <Box component="span" sx={{ color: 'primary.main' }}>one tap away.</Box>
              </Box>
              <Box sx={{ color: 'text.secondary', mt: 1.5, fontSize: { xs: 14, md: 16 } }}>
                Start a WhatsApp chat, create a shareable link, or make a QR code. No contact saving needed.
              </Box>
            </Box>
            <Stack direction="row" spacing={1} sx={{
              alignItems: 'center',
              border: 1, borderColor: 'divider', borderRadius: 99, px: 1.5, py: 0.9,
              color: 'text.secondary', fontSize: 12, bgcolor: 'background.paper',
            }}>
              <ShieldCheck size={16} color="#16845b" />
              Runs privately in your browser
            </Stack>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.15fr) minmax(340px, .85fr)' },
            gap: { xs: 2, md: 3 },
            alignItems: 'stretch',
          }}>
            <PhoneForm
              countryCode={countryCode}
              onCountryCodeChange={setCountryCode}
              phone={phone}
              onPhoneChange={setPhone}
              message={message}
              onMessageChange={setMessage}
              businessName={businessName}
              onBusinessNameChange={setBusinessName}
              maxPhoneDigits={maxPhoneDigits}
              isValid={isValid}
              onOpenWhatsApp={openWhatsApp}
              onCopyLink={copyLink}
            />
            <LinkPreview
              link={waLink}
              message={message}
              phone={phone}
              countryCode={countryCode}
              businessName={businessName}
              onDownload={(text, severity) => showNotice(text, severity)}
            />
          </Box>

          <RecentHistory
            history={history}
            onSelect={useHistoryEntry}
            onClear={clearHistory}
          />

          <Box
            component="footer"
            sx={{
              mt: 5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              color: 'text.secondary',
              fontSize: 12,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ minWidth: 0, alignItems: 'center' }}>
              <MessageCircle size={15} />
              <Box sx={{ minWidth: 0, textAlign: { xs: 'center', sm: 'left' } }}>
                TapToChat is an independent utility and is not affiliated with WhatsApp or Meta.
              </Box>
            </Stack>
            <Box sx={{ textAlign: 'center' }}>Developed by - Chandan Raj</Box>
          </Box>
        </Container>

        <Snackbar
          open={notice.open}
          autoHideDuration={3500}
          onClose={() => setNotice((current) => ({ ...current, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setNotice((current) => ({ ...current, open: false }))}
            severity={notice.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notice.text}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default App
