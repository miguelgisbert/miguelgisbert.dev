import './ContactForm.css'
import React, { useRef } from 'react'
import emailjs from '@emailjs/browser'
import { TextField, Button, Box, Typography } from '@mui/material'

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement | null>(null)

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault()

    if (form.current) {
      emailjs.sendForm('service_7514287', 'template_beig3l2', form.current, 'hFqS9l2zhgBOtS0HT')
        .then(() => {
            alert('Message submited!')
            form.current?.reset()
        }, (error) => {
            console.error('Error:', error.text)
            alert('There was a problem, please try again later or contact miguelg314@gmail.com')
        })
    }
  }

  return (
    <Box component="form" ref={form} onSubmit={sendEmail} sx={{ maxWidth: 500, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Contact
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        id="form_name"
        name="form_name"
        required
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        id="form_email"
        name="form_email"
        type="email"
        required
      />
      <TextField
        label="Message"
        variant="outlined"
        fullWidth
        id="message"
        name="message"
        multiline
        rows={4}
        required
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Box>
  )
}

export default ContactForm
