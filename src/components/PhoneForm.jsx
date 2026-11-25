import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowUpRight, Copy, MessageCircle, Smartphone } from 'lucide-react'

const countries = [
  { name: 'India', code: '91', flag: '🇮🇳' },
  { name: 'United States', code: '1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '44', flag: '🇬🇧' },
  { name: 'Australia', code: '61', flag: '🇦🇺' },
  { name: 'United Arab Emirates', code: '971', flag: '🇦🇪' },
  { name: 'Singapore', code: '65', flag: '🇸🇬' },
  { name: 'Pakistan', code: '92', flag: '🇵🇰' },
]

const templates = [
  'Hello, I have an inquiry',
  'Please share your location',
  'Could you send me more details?',
]

function PhoneForm({
  countryCode,
  onCountryCodeChange,
  phone,
  onPhoneChange,
  message,
  onMessageChange,
  businessName,
  onBusinessNameChange,
  maxPhoneDigits,
  isValid,
  onOpenWhatsApp,
  onCopyLink,
}) {
  const country = countries.find((item) => item.code === countryCode)
  const phoneError = Boolean(phone) && !isValid

  return (
    <Paper elevation={0} sx={{ minWidth: 0, p: { xs: 2, sm: 3, md: 3.5 }, border: 1, borderColor: 'divider' }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
        <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', bgcolor: 'primary.light', color: 'primary.main', borderRadius: 3 }}>
          <Smartphone size={21} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>Create your chat link</Typography>
          <Typography variant="body2" color="text.secondary">No data is sent to our servers.</Typography>
        </Box>
      </Stack>

      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Phone number</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1, minWidth: 0, width: '100%' }}>
        <FormControl sx={{ width: { xs: 122, sm: 170 }, flexShrink: 0 }}>
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            id="country-code"
            value={countryCode}
            label="Country"
            onChange={(event) => onCountryCodeChange(event.target.value)}
            renderValue={(selected) => {
              const selectedCountry = countries.find((item) => item.code === selected)
              return `${selectedCountry?.flag || ''} +${selected}`
            }}
          >
            {countries.map((item) => (
              <MenuItem key={item.code} value={item.code}>{item.flag} &nbsp; {item.name} (+{item.code})</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          sx={{ minWidth: 0, flex: 1 }}
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value.replace(/\D/g, '').slice(0, maxPhoneDigits))}
          placeholder={countryCode === '91' ? '9876543210' : 'Enter phone number'}
          error={phoneError}
          slotProps={{
            htmlInput: { inputMode: 'numeric', 'aria-label': 'Mobile phone number', maxLength: maxPhoneDigits },
          }}
        />
      </Stack>
      <Typography variant="caption" color={phoneError ? 'error.main' : 'text.secondary'}>
        {phoneError
          ? countryCode === '91' ? 'Enter a valid 10-digit mobile number.' : `Enter a valid number with 7–${maxPhoneDigits} digits.`
          : `Include the number without the country code. ${country ? `${country.flag} +${country.code} selected.` : ''}`}
      </Typography>

      <Box sx={{ mt: 2.5 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Business or poster name <Typography component="span" variant="caption" color="text.secondary">(optional)</Typography>
        </Typography>
        <TextField
          fullWidth
          value={businessName}
          onChange={(event) => onBusinessNameChange(event.target.value.slice(0, 60))}
          placeholder="e.g. The Green Corner"
          slotProps={{ htmlInput: { 'aria-label': 'Business or poster name', maxLength: 60 } }}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Stack direction="row" sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Pre-filled message</Typography>
          <Typography variant="caption" color="text.secondary">{message.length}/1000</Typography>
        </Stack>
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={5}
          value={message}
          onChange={(event) => onMessageChange(event.target.value.slice(0, 1000))}
          placeholder="Write a message to start the conversation..."
          slotProps={{ htmlInput: { 'aria-label': 'Pre-filled WhatsApp message', maxLength: 1000 } }}
        />
        <Stack direction="row" sx={{ mt: 1.3, flexWrap: 'wrap', columnGap: 0.8, rowGap: 0.8 }}>
          {templates.map((template) => (
            <Chip
              key={template}
              label={template}
              size="small"
              variant="outlined"
              onClick={() => onMessageChange(template)}
              sx={{ cursor: 'pointer', maxWidth: '100%' }}
            />
          ))}
        </Stack>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mt: 3 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!isValid}
          onClick={onOpenWhatsApp}
          startIcon={<MessageCircle size={18} />}
          endIcon={<ArrowUpRight size={17} />}
          sx={{ boxShadow: 'none', py: 1.3 }}
        >
          Chat on WhatsApp
        </Button>
        <Button
          fullWidth
          variant="outlined"
          size="large"
          disabled={!isValid}
          onClick={onCopyLink}
          startIcon={<Copy size={17} />}
          sx={{ py: 1.3 }}
        >
          Copy link
        </Button>
      </Stack>
      <Stack direction="row" spacing={0.8} sx={{ mt: 2, alignItems: 'center', color: 'text.secondary' }}>
        <MessageCircle size={14} />
        <Typography variant="caption">Opens WhatsApp on mobile or WhatsApp Web on desktop.</Typography>
      </Stack>
    </Paper>
  )
}

export default PhoneForm
