import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useDataProvider, useListContext } from "react-admin";
import { useMutation } from "react-query";
import type { Ticket } from ".";
import { TicketsByStatus, getTicketsByStatus, statuses } from ".";
import { MyDataProvider } from "../dataProvider";
import { TicketColumn } from "./TicketColumn";

import React from "react";


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

  const mutation = useMutation<
    void,
    Error,
    {
      source: Parameters<MyDataProvider["updateTicketStatus"]>[0];
      destination: Parameters<MyDataProvider["updateTicketStatus"]>[1];
    }
  >(
    ({ source, destination }) =>
      dataProvider.updateTicketStatus(source, destination),
    { onSettled: () => refetch() }
  );

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
    const destinationTicket = ticketsByStatus[destinationStatus][
      destination.index
    ] ?? {
      status: destinationStatus,
      index: undefined, // undefined if dropped after the last item
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
    mutation.mutateAsync({
      source: sourceTicket,
      destination: destinationTicket,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex">
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