import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material';
import { Chat, Close } from '@mui/icons-material';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

// Simple rule-based steps – can be replaced with real NLP service later
const steps = [
  {
    id: '0',
    message: 'Hi! I\'m CivicBot 🤖. How can I help you today?',
    trigger: 'help-options'
  },
  {
    id: 'help-options',
    options: [
      { value: 'report', label: 'Report an Issue', trigger: 'report-type' },
      { value: 'track', label: 'Track my Complaint', trigger: 'track-id' },
      { value: 'contact', label: 'Contact Department', trigger: 'contact-dept' }
    ]
  },
  {
    id: 'report-type',
    message: 'What type of issue would you like to report? (e.g., pothole, garbage, street light)',
    trigger: 'get-location'
  },
  {
    id: 'get-location',
    message: 'Please share the location / ward number of the issue.',
    trigger: 'report-summary'
  },
  {
    id: 'report-summary',
    message: 'Thank you! Your report has been drafted. Submit via the "Report Issue" button on the homepage. Anything else?',
    trigger: 'anything-else'
  },
  {
    id: 'track-id',
    message: 'Please enter your complaint tracking ID.',
    trigger: 'track-status'
  },
  {
    id: 'track-status',
    message: 'Your complaint is currently \"In Progress\" and assigned to the field officer. Anything else?',
    trigger: 'anything-else'
  },
  {
    id: 'contact-dept',
    message: 'Which department would you like to contact? (e.g., Sanitation, Electricity)',
    trigger: 'contact-response'
  },
  {
    id: 'contact-response',
    message: 'You can reach the selected department via +91-11-12345678 or email civic@jharkhand.gov.in. Anything else?',
    trigger: 'anything-else'
  },
  {
    id: 'anything-else',
    options: [
      { value: 'yes', label: 'Yes', trigger: 'help-options' },
      { value: 'no', label: 'No', trigger: 'goodbye' }
    ]
  },
  {
    id: 'goodbye',
    message: 'Glad I could help! Have a great day 👋',
    end: true
  }
];

const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#2ecc71',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#2ecc71',
  botFontColor: '#fff',
  userBubbleColor: '#e0e0e0',
  userFontColor: '#4a4a4a'
};

export default function ChatbotDialog({ position = { bottom: 110, right: 30 } }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ position: 'fixed', zIndex: 1200, ...position }}>
      {/* Floating FAB */}
      <Fab
        color="primary"
        aria-label="chatbot"
        onClick={() => setOpen(true)}
        sx={{ boxShadow: '0 6px 15px rgba(0,0,0,0.25)' }}
      >
        <Chat />
      </Fab>

      {/* Dialog with Chatbot */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          CivicBot Assistant
          <IconButton onClick={() => setOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <ThemeProvider theme={theme}>
            <ChatBot steps={steps} headerTitle="" />
          </ThemeProvider>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
