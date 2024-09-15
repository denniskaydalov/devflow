
// organizes tickets based on status

import type { Ticket } from ".";

export const statuses: Ticket["status"][] = [
  "in_dev",
  "in_test",
  "in_review",
  "done"
];

export const statusNames: Record<Ticket["status"], string> = {
  in_dev: "In Dev",
  in_test: "In Test",
  in_review: "In Review",
  done: "Done"
};

export type TicketsByStatus = Record<Ticket["status"], Ticket[]>;

export const getTicketsByStatus = (unorderedTickets: Ticket[]) => {
  const ticketsByStatus: TicketsByStatus = unorderedTickets.reduce(
    (acc, ticket) => {
      acc[ticket.status].push(ticket);
      return acc;
    },
    statuses.reduce(
      (obj, status) => ({ ...obj, [status]: [] }),
      {} as TicketsByStatus
    )
  );
  // order each column by index
  statuses.forEach((status) => {
    ticketsByStatus[status] = ticketsByStatus[status].sort(
      (recordA: Ticket, recordB: Ticket) => recordA.index - recordB.index
    );
  });
  return ticketsByStatus;
};