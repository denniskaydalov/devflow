import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useDataProvider, useListContext } from "react-admin";
import { useMutation } from '@tanstack/react-query';
import type { Ticket } from ".";
import { TicketsByStatus, getTicketsByStatus, statuses } from ".";
import { MyDataProvider } from "../dataProvider";
import { TicketColumn } from "./TicketColumn";

export const TicketListContent = () => {
  const { data: unorderedTickets, isLoading, refetch } = useListContext<Ticket>();
  const dataProvider = useDataProvider<MyDataProvider>();

  const [ticketsByStatus, setTicketsByStatus] = useState<TicketsByStatus>(
    getTicketsByStatus([])
  );

  useEffect(() => {
    if (unorderedTickets) {
      const newTicketsByStatus = getTicketsByStatus(unorderedTickets);
      if (!isEqual(newTicketsByStatus, ticketsByStatus)) {
        setTicketsByStatus(newTicketsByStatus);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unorderedTickets]);

  const mutation = useMutation({
    mutationFn: async ({
      source,
      destination,
    }: {
      source: Ticket;
      destination: Partial<Ticket> & { status: Ticket["status"]; index?: number };
    }) => {
      if (!destination.id) {
        throw new Error('Destination ticket is missing ID');
      }
      await dataProvider.updateTicketStatus(source, destination as Ticket);
    },
    onSettled: () => {
      refetch(); // Refetch data after mutation
    },
    onError: (error) => {
      console.error('Error updating ticket status:', error);
    },
  });

  if (isLoading) return null;

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
  
    if (!destination) {
      return;
    }
  
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  
    const sourceStatus = source.droppableId as Ticket["status"];
    const destinationStatus = destination.droppableId as Ticket["status"];
    const sourceTicket = ticketsByStatus[sourceStatus][source.index]!;
  
    // Ensure destinationTicket is a full Ticket or handle as a partial object
    const destinationTicket: Ticket = {
      id: 0, 
      title: 'Temp Title',
      content: 'Temp Content',
      reporter: 'Temp Reporter',
      status: destinationStatus,
      index: destination.index,
    };
  
    // compute local state change synchronously
    setTicketsByStatus(
      updateTicketStatusLocal(
        sourceTicket,
        { status: sourceStatus, index: source.index },
        { status: destinationStatus, index: destination.index },
        ticketsByStatus
      )
    );

    // trigger the mutation to persist the changes
    mutation.mutate({
      source: sourceTicket,
      destination: destinationTicket,
    });
  };  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        display="flex"
        sx={{
          gap: 1,
          '& > *': {
            borderRadius: 0.8,
            overflow: 'hidden',
          },
        }}
      >
        {statuses.map((status) => (
          <TicketColumn
            status={status}
            tickets={ticketsByStatus[status]}
            key={status}
          />
        ))}
      </Box>
    </DragDropContext>
  );
};

const updateTicketStatusLocal = (
  sourceTicket: Ticket,
  source: { status: Ticket["status"]; index: number },
  destination: {
    status: Ticket["status"];
    index?: number; // undefined if dropped after the last item
  },
  ticketsByStatus: TicketsByStatus
) => {
  if (source.status === destination.status) {
    // moving deal inside the same column
    const column = ticketsByStatus[source.status];
    column.splice(source.index, 1);
    column.splice(destination.index ?? column.length + 1, 0, sourceTicket);
    return {
      ...ticketsByStatus,
      [destination.status]: column,
    };
  } else {
    // moving deal across columns
    const sourceColumn = ticketsByStatus[source.status];
    const destinationColumn = ticketsByStatus[destination.status];
    sourceColumn.splice(source.index, 1);
    destinationColumn.splice(
      destination.index ?? destinationColumn.length + 1,
      0,
      sourceTicket
    );
    return {
      ...ticketsByStatus,
      [source.status]: sourceColumn,
      [destination.status]: destinationColumn,
    };
  }
};
