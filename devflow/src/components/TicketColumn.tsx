import { Droppable } from "@hello-pangea/dnd";
import { Box, Typography } from "@mui/material";

import type { Ticket } from ".";
import { statusNames } from ".";
import { TicketCard } from "./TicketCard";
import React from "react";

export const TicketColumn = ({
  status,
  posts,
}: {
  status: Ticket["status"];
  posts: Ticket[];
}) => (
  <Box
    sx={{
      flex: 1,
      paddingTop: "8px",
      paddingBottom: "16px",
      bgcolor: "#eaeaee",
      "&:first-child": {
        paddingLeft: "5px",
        borderTopLeftRadius: 5,
      },
      "&:last-child": {
        paddingRight: "5px",
        borderTopRightRadius: 5,
      },
    }}
  >
    <Typography align="center" variant="subtitle1">
      {statusNames[status]}
    </Typography>
    <Droppable droppableId={status}>
      {(droppableProvided, snapshot) => (
        <Box
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className={snapshot.isDraggingOver ? " isDraggingOver" : ""}
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: 5,
            padding: "5px",
            "&.isDraggingOver": {
              bgcolor: "#dadadf",
            },
          }}
        >
          {ticket.map((ticket, index) => (
            <TicketCard key={ticket.id} ticket={ticket} index={index} />
          ))}
          {droppableProvided.placeholder}
        </Box>
      )}
    </Droppable>
  </Box>
);