import { List, SearchInput } from "react-admin";
import { useMediaQuery, Typography, Theme } from "@mui/material";
import React from "react"; // added this import to keep it functional

import { TicketListContent } from "./TicketListContent";

const ticketFilters = [
  // eslint-disable-next-line react/jsx-key
  <SearchInput source="q" alwaysOn />,
];

export const TicketList = () => {
  return (
    <List
      filters={ticketFilters}
      perPage={100}
      sort={{ field: "index", order: "ASC" }}
      pagination={false}
      component="div"
    >
      <TicketListContent />
    </List>
  );
};

export default TicketList;
