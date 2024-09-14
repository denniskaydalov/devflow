import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Ticket } from ".";

interface TicketModalProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ ticket, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {ticket.title}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 16, top: 5, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {ticket.content}
        </Typography>
        {/* You can add more details or actions here if needed */}
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
