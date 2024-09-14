import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Box, Typography, TextField, MenuItem, Button } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Ticket, statuses, statusNames } from ".";
import axios from 'axios';

const people = ['Alice', 'Bob', 'Charlie']; // Temporary hardcoded users

const TicketModal = ({ open, onClose, ticket }) => {
  const [status, setStatus] = useState(ticket.status || '');
  const [assignee, setAssignee] = useState(ticket.assignee || 'Unassigned');
  const [reporter, setReporter] = useState(ticket.reporter || 'Unassigned');

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleAssigneeChange = (event: SelectChangeEvent) => {
    setAssignee(event.target.value);
  };

  const handleReporterChange = (event: SelectChangeEvent) => {
    setReporter(event.target.value);
  };

  const updateTicket = async (updatedTicket: Ticket) => {
    try {
      await axios.put(`/api/tickets/${updatedTicket.id}`, updatedTicket);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleSave = () => {
    const updatedTicket = {
      ...ticket,
      status,
      assignee: assignee === 'Unassigned' ? null : assignee,
      reporter: reporter === 'Unassigned' ? null : reporter,
    };
    updateTicket(updatedTicket);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogContent sx={{ padding: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 3 }}>
            <Typography variant="h5" component="div" gutterBottom>
              {ticket.title}
            </Typography>
            <Typography variant="body1">
              {ticket.content}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography variant="subtitle1">Status</Typography>
              <TextField
                select
                value={status}
                onChange={handleStatusChange}
                variant="outlined"
                fullWidth
                sx={{ 
                  marginBottom: 1,
                  '& .MuiSelect-select': {
                    fontSize: '0.8rem', 
                    height: '20px',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200, 
                      '& .MuiMenuItem-root': {
                        fontSize: '0.8rem', 
                        height: '20px', 
                      },
                    },
                  },
                }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {statusNames[status]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography variant="subtitle1">Assignee</Typography>
              <TextField
                select
                value={assignee}
                onChange={handleAssigneeChange}
                variant="outlined"
                fullWidth
                sx={{ 
                  marginBottom: 1,
                  '& .MuiSelect-select': {
                    fontSize: '0.8rem',
                    height: '20px',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.8rem',
                        height: '20px',
                      },
                    },
                  },
                }}
              >
                <MenuItem key="Unassigned" value="Unassigned">
                  Unassigned
                </MenuItem>
                {people.map((person) => (
                  <MenuItem key={person} value={person}>
                    {person}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box>
              <Typography variant="subtitle1">Reporter</Typography>
              <TextField
                select
                value={reporter}
                onChange={handleReporterChange}
                variant="outlined"
                fullWidth
                sx={{ 
                  marginBottom: 1,
                  '& .MuiSelect-select': {
                    fontSize: '0.8rem',
                    height: '20px',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.8rem',
                        height: '20px',
                      },
                    },
                  },
                }}
              >
                <MenuItem key="Unassigned" value="Unassigned">
                  Unassigned
                </MenuItem>
                {people.map((person) => (
                  <MenuItem key={person} value={person}>
                    {person}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketModal;
