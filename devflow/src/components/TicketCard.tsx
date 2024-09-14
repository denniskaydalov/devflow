import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import { ShowButton } from "react-admin";
import type { Ticket } from ".";

export const TicketCard = ({ ticket, index }: { ticket: Ticket; index: number }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleCardClick = () => {
    setShowDetails(!showDetails);
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
            <CardActions>
              {showDetails && (
                <ShowButton resource="tickets" record={ticket} />
              )}
            </CardActions>
          </Card>
        </Box>
      )}
    </Draggable>
  );
};

export default TicketCard;
