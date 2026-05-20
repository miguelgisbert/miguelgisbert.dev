import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { TextField, Button, Box } from '@mui/material'

type Status = 'idle' | 'sending' | 'success' | 'error'

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.current) return
    setStatus('sending')
    emailjs
      .sendForm('service_7514287', 'template_beig3l2', form.current, 'hFqS9l2zhgBOtS0HT')
      .then(
        () => {
          setStatus('success')
          form.current?.reset()
        },
        () => {
          setStatus('error')
        },
      )
  }

  return (
    <section id="contact" className="section">
      <div className="section__inner">
        <div className="section__header text-center" style={{ textAlign: 'center' }}>
          <h2 className="section__title">Contact</h2>
          <p className="section__subtitle">Have a project in mind? Let's talk</p>
        </div>
        <Box
          component="form"
          ref={form}
          onSubmit={sendEmail}
          className="contact-form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Name"
            name="from_name"
            required
            fullWidth
            disabled={status === 'sending'}
            sx={{
              '& .MuiOutlinedInput-root': { background: '#1a1a1a', borderRadius: '8px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a2a !important' },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#64ffda !important', borderWidth: '1px !important' },
              '& .MuiInputLabel-root': { color: '#555 !important' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#64ffda !important' },
              '& .MuiInputBase-input': { color: '#fafafa !important' },
              '& .MuiInputBase-input:-webkit-autofill': { WebkitBoxShadow: '0 0 0 100px #1a1a1a inset', WebkitTextFillColor: '#fafafa' },
            }}
          />
          <TextField
            label="Email"
            name="from_email"
            type="email"
            required
            fullWidth
            disabled={status === 'sending'}
            sx={{
              '& .MuiOutlinedInput-root': { background: '#1a1a1a', borderRadius: '8px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a2a !important' },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#64ffda !important', borderWidth: '1px !important' },
              '& .MuiInputLabel-root': { color: '#555 !important' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#64ffda !important' },
              '& .MuiInputBase-input': { color: '#fafafa !important' },
              '& .MuiInputBase-input:-webkit-autofill': { WebkitBoxShadow: '0 0 0 100px #1a1a1a inset', WebkitTextFillColor: '#fafafa' },
            }}
          />
          <TextField
            label="Message"
            name="message"
            multiline
            rows={4}
            required
            fullWidth
            disabled={status === 'sending'}
            sx={{
              '& .MuiOutlinedInput-root': { background: '#1a1a1a', borderRadius: '8px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a2a !important' },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#64ffda !important', borderWidth: '1px !important' },
              '& .MuiInputLabel-root': { color: '#555 !important' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#64ffda !important' },
              '& .MuiInputBase-input': { color: '#fafafa !important' },
            }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={status === 'sending'}
            sx={{
              bgcolor: '#64ffda',
              color: '#0a0a0a',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#45e0be' },
              '&.Mui-disabled': { bgcolor: '#2a2a2a', color: '#555' },
            }}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </Button>
          {status === 'success' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: '#64ffda',
                bgcolor: 'rgba(100,255,218,0.06)',
                color: '#64ffda',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="#64ffda" strokeWidth="1.5" />
                <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#64ffda" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Message sent successfully! I'll get back to you soon.
            </Box>
          )}
          {status === 'error' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: '#ff6b6b',
                bgcolor: 'rgba(255,107,107,0.06)',
                color: '#ff6b6b',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" stroke="#ff6b6b" strokeWidth="1.5" />
                <path d="M6 6l6 6M12 6l-6 6" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Something went wrong. Try again or email me at{' '}
              <Box component="a" href="mailto:miguelg314@gmail.com" sx={{ color: '#ff6b6b', textDecoration: 'underline', fontWeight: 600 }}>
                miguelg314@gmail.com
              </Box>
            </Box>
          )}
        </Box>
      </div>
    </section>
  )
}

export default ContactForm
