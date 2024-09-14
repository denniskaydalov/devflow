import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Ticket } from ".";

export const TicketCard = ({ ticket, index }: { ticket: Ticket; index: number }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
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
              <Typography variant="h5" component="div">
                {ticket.title}
              </Typography>
              <Typography variant="body2">{ticket.content}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
};
