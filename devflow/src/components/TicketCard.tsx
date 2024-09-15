import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Box, Card, CardContent, Typography } from "@mui/material";
import TicketModal from "./TicketModal";

import type { Ticket } from ".";
import React from "react";

export const TicketCard = ({ ticket, index }: { ticket: Ticket; index: number }) => {
  const [open, setOpen] = useState(false);

  const handleCardClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Draggable draggableId={String(ticket.id)} index={index}>
        {(provided, snapshot) => (
          <Box
            sx={{
              marginBottom: 1,
              cursor: "pointer",
              '&:hover': {
                '.MuiCard-root': {
                  backgroundColor: '#e6e7e8',
                },
              },
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Card
              style={{
                opacity: snapshot.isDragging ? 0.9 : 1,
                transform: snapshot.isDragging ? "rotate(-2deg)" : "",
                transition: 'background-color 0.3s ease',
              }}
              elevation={snapshot.isDragging ? 3 : 1}
              onClick={handleCardClick}
            >
              <CardContent>
                <Typography variant="body1">{ticket.title}</Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Draggable>

      <TicketModal ticket={ticket} open={open} onClose={handleClose} />
    </>
  );
};
