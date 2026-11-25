import { AppBar, Box, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import { MessageCircle, Moon, Sun } from 'lucide-react'

function Header({ mode, onToggleTheme }) {
  const dark = mode === 'dark'

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{
      borderBottom: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}>
      <Toolbar sx={{ px: { xs: 1.5, sm: 3, lg: 5 }, minHeight: { xs: 62, sm: 70 } }}>
        <Stack direction="row" spacing={1.2} sx={{ flexGrow: 1, alignItems: 'center' }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: 2.5, bgcolor: 'primary.main', color: '#fff',
            display: 'grid', placeItems: 'center',
          }}>
            <MessageCircle size={21} strokeWidth={2.5} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
            tap<Box component="span" sx={{ color: 'primary.main' }}>to</Box>chat
          </Typography>
          <Box sx={{
            display: { xs: 'none', sm: 'block' }, color: 'text.secondary', fontSize: 12,
            borderLeft: 1, borderColor: 'divider', pl: 1.5, ml: 0.5,
          }}>
            WhatsApp link maker
          </Box>
        </Stack>
        <Tooltip title={`Switch to ${dark ? 'light' : 'dark'} theme`}>
          <IconButton
            aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
            onClick={onToggleTheme}
            sx={{ color: 'text.primary', border: 1, borderColor: 'divider', borderRadius: 2.5 }}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

export default Header
