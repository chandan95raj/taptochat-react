import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { Clock3, Trash2 } from 'lucide-react'

function RecentHistory({ history, onSelect, onClear }) {
  return (
    <Paper elevation={0} sx={{ mt: 3, p: { xs: 2, sm: 2.5 }, border: 1, borderColor: 'divider' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1, alignItems: 'center' }}>
          <Clock3 size={18} color="#16845b" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Recent chats</Typography>
            <Typography variant="caption" color="text.secondary">Saved only in this browser · up to 6 numbers</Typography>
          </Box>
        </Stack>
        {history.length > 0 && (
          <Button
            size="small"
            color="inherit"
            startIcon={<Trash2 size={15} />}
            onClick={onClear}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, color: 'text.secondary' }}
          >
            Clear history
          </Button>
        )}
      </Stack>
      {history.length > 0 ? (
        <Stack direction="row" sx={{ mt: 2, flexWrap: 'wrap', columnGap: 1, rowGap: 1 }}>
          {history.map((entry) => (
            <Chip
              key={`${entry.countryCode}-${entry.phone}`}
              label={`+${entry.countryCode} ${entry.phone}`}
              variant="outlined"
              onClick={() => onSelect(entry)}
              sx={{ fontWeight: 500, bgcolor: 'background.default' }}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          Your recent numbers will show up here when you create or copy a link.
        </Typography>
      )}
    </Paper>
  )
}

export default RecentHistory
