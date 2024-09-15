import { List, SearchInput } from "react-admin";
import { useMediaQuery, Typography, Theme } from "@mui/material";
import React from "react"; // added this import to keep it functional

import { TicketListContent } from "./TicketListContent.tsx";

const ticketFilters = [
  // eslint-disable-next-line react/jsx-key
  <SearchInput source="q" alwaysOn />,
];

export const TicketList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  return (
    <List
      filters={ticketFilters}
      perPage={100}
      sort={{ field: "index", order: "ASC" }}
      pagination={false}
      component="div"
    >
      {isSmall ? <FallbackForMobile /> : <TicketListContent />}
    </List>
  );
};

const FallbackForMobile = () => (
  <Typography mt={3} align="center">
    Currently not supported on mobile devices.
  </Typography>
);