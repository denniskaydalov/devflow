// Organizes tickets by status

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

export const getTicketsByStatus = (unorderedPosts: Ticket[]) => {
  const ticketsByStatus: TicketsByStatus = unorderedPosts.reduce(
    (acc, post) => {
      acc[post.status].push(post);
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