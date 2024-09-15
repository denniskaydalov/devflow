import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Typography, IconButton } from '@mui/material'; 
import CloseIcon from '@mui/icons-material/Close';
import { statusNames, Ticket } from '.';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket;
}

const TicketModal: React.FC<TicketModalProps> = ({ open, onClose, ticket }) => {
  const [status] = useState(ticket.status || '');
  const [assignee] = useState(ticket.assignee || 'Unassigned');
  const [reporter] = useState(ticket.reporter);
  const [branch] = useState(ticket.branch);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent sx={{ padding: 4, position: 'relative' }}>
        <IconButton 
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 3 }}>
            <Typography variant="h5" component="div" gutterBottom>
              {ticket.title}
            </Typography>
            <Typography variant="body1">
              {ticket.content}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1">Status</Typography>
              <Box component="div" sx={{ 
                display: 'inline', 
                fontSize: '0.75rem',
                padding: '0.3rem',
                border: '1px solid #ddd', 
                borderRadius: '4px',
                marginTop: '0.8rem'
              }}>
                {status ? statusNames[status] : 'No status'}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1">Assignee</Typography>
              <Box component="div" sx={{ 
                display: 'inline', 
                fontSize: '0.75rem',
                padding: '0.3rem',
                border: '1px solid #ddd', 
                borderRadius: '4px',
                marginTop: '0.8rem'
              }}>
                {assignee}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1">Reporter</Typography>
              <Box component="div" sx={{ 
                display: 'inline', 
                fontSize: '0.75rem',
                padding: '0.3rem',
                border: '1px solid #ddd', 
                borderRadius: '4px',
                marginTop: '0.8rem'
              }}>
                {reporter}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1">Branch</Typography>
              <Box component="div" sx={{ 
                display: 'inline', 
                fontSize: '0.75rem',
                padding: '0.3rem',
                border: '1px solid #ddd', 
                borderRadius: '4px',
                marginTop: '0.8rem'
              }}>
                {branch}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
