import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Box, Typography, MenuItem, Button, Select, SelectChangeEvent } from '@mui/material'; 
import { statuses, statusNames, Ticket } from '.';

const people = ['Alice', 'Bob', 'Charlie']; // Temporary hardcoded users

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket;
}

const TicketModal: React.FC<TicketModalProps> = ({ open, onClose, ticket }) => {
  const [status, setStatus] = useState(ticket.status || '');
  const [assignee, setAssignee] = useState(ticket.assignee || 'Unassigned');
  const [reporter, setReporter] = useState(ticket.reporter || 'Unassigned');

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value);
  };

  const handleAssigneeChange = (event: SelectChangeEvent<string>) => {
    setAssignee(event.target.value);
  };

  const handleReporterChange = (event: SelectChangeEvent<string>) => {
    setReporter(event.target.value);
  };

  const updateTicket = async (updatedTicket: Ticket) => {
    // Implementation of the updateTicket function
  };

  const handleSave = () => {
    const updatedTicket = {
      ...ticket,
      status,
      assignee: assignee === 'Unassigned' ? null : assignee,
      reporter: reporter === 'Unassigned' ? null : reporter,
    };
    // updateTicket(updatedTicket);
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
              <Select
                value={status}
                onChange={handleStatusChange}
                variant="outlined"
                fullWidth
                sx={{ 
                  marginBottom: 1,
                  fontSize: '0.8rem',
                  height: '40px', // Set height for the select
                  '& .MuiSelect-select': {
                    height: '40px', // Ensure select content is vertically centered
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.8rem',
                        height: '30px', // Adjust the height of the menu items
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
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle1">Assignee</Typography>
              <Select
                value={assignee}
                onChange={handleAssigneeChange}
                variant="outlined"
                fullWidth
                sx={{ 
                  marginBottom: 1,
                  fontSize: '0.8rem',
                  height: '40px', // Set height for the select
                  '& .MuiSelect-select': {
                    height: '40px', // Ensure select content is vertically centered
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.8rem',
                        height: '30px', // Adjust the height of the menu items
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
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle1">Reporter</Typography>
              <Select
                value={reporter}
                onChange={handleReporterChange}
                variant="outlined"
                fullWidth
                sx={{ 
                  marginBottom: 1,
                  fontSize: '0.8rem',
                  height: '40px', // Set height for the select
                  '& .MuiSelect-select': {
                    height: '40px', // Ensure select content is vertically centered
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 200,
                      '& .MuiMenuItem-root': {
                        fontSize: '0.8rem',
                        height: '30px', // Adjust the height of the menu items
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
              </Select>
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
