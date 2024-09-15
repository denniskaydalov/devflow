import fakeRestDataProvider from "ra-data-fakerest";
import { DataProvider } from "react-admin";
import data from "./data.json";
import { Ticket, getTicketsByStatus } from "./components";

const baseDataProvider = fakeRestDataProvider(data, true);

export interface MyDataProvider extends DataProvider {
  updateTicketStatus: (
    // eslint-disable-next-line no-unused-vars
    source: Ticket,
    // eslint-disable-next-line no-unused-vars
    destination: {
      status: Ticket["status"];
      index?: number; // undefined if dropped after the last item
    }
  ) => Promise<void>;
}

export const dataProvider: MyDataProvider = {
  ...baseDataProvider,
  updateTicketStatus: async (source, destination) => {
    const { data: unorderedTickets } = await dataProvider.getList<Ticket>("tickets", {
      sort: { field: "index", order: "ASC" },
      pagination: { page: 1, perPage: 100 },
      filter: {},
    });

    const ticketsByStatus = getTicketsByStatus(unorderedTickets);

    if (source.status === destination.status) {
      // moving ticket inside the same column

      const columnTickets = ticketsByStatus[source.status];
      const destinationIndex = destination.index ?? columnTickets.length + 1;

      if (source.index > destinationIndex) {
        // ticket moved up, eg
        // dest   src
        //  <------
        // [4, 7, 23, 5]

        await Promise.all([
          // for all tickets between destinationIndex and source.index, increase the index
          ...columnTickets
            .filter(
              (ticket) =>
                ticket.index >= destinationIndex && ticket.index < source.index
            )
            .map((ticket) =>
              dataProvider.update("tickets", {
                id: ticket.id,
                data: { index: ticket.index + 1 },
                previousData: ticket,
              })
            ),
          // for the ticket that was moved, update its index
          dataProvider.update("tickets", {
            id: source.id,
            data: { index: destinationIndex },
            previousData: source,
          }),
        ]);
      } else {
        // ticket moved down, e.g
        // src   dest
        //  ------>
        // [4, 7, 23, 5]

        await Promise.all([
          // for all tickets between source.index and destinationIndex, decrease the index
          ...columnTickets
            .filter(
              (ticket) =>
                ticket.index <= destinationIndex && ticket.index > source.index
            )
            .map((ticket) =>
              dataProvider.update("tickets", {
                id: ticket.id,
                data: { index: ticket.index - 1 },
                previousData: ticket,
              })
            ),
          // for the ticket that was moved, update its index
          dataProvider.update("tickets", {
            id: source.id,
            data: { index: destinationIndex },
            previousData: source,
          }),
        ]);
      }
    } else {
      // moving ticket across columns

      const sourceColumn = ticketsByStatus[source.status];
      const destinationColumn = ticketsByStatus[destination.status];
      const destinationIndex =
        destination.index ?? destinationColumn.length + 1;

      await Promise.all([
        // decrease index on the tickets after the source index in the source columns
        ...sourceColumn
          .filter((ticket) => ticket.index > source.index)
          .map((ticket) =>
            dataProvider.update("tickets", {
              id: ticket.id,
              data: { index: ticket.index - 1 },
              previousData: ticket,
            })
          ),
        // increase index on the tickets after the destination index in the destination columns
        ...destinationColumn
          .filter((ticket) => ticket.index >= destinationIndex)
          .map((ticket) =>
            dataProvider.update("tickets", {
              id: ticket.id,
              data: { index: ticket.index + 1 },
              previousData: ticket,
            })
          ),
        // change the dragged ticket to take the destination index and column
        dataProvider.update("tickets", {
          id: source.id,
          data: {
            index: destinationIndex,
            status: destination.status,
          },
          previousData: source,
        }),
      ]);
    }
  },
};