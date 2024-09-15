import { List, SearchInput } from 'react-admin';
import { Box, Typography } from '@mui/material';
import { TicketListContent } from './TicketListContent';
import LogoutButton from './LogoutButton';

const ticketFilters = [
  // eslint-disable-next-line react/jsx-key
  <SearchInput
    source="q"
    alwaysOn
    sx={{ mb: 2 }}
  />,
];

export const TicketList = () => {
  return (
    <Box
      sx={{
        marginRight: 8,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
        >
          Jira board
        </Typography>
        <LogoutButton />
      </Box>
      <List
        filters={ticketFilters}
        perPage={100}
        sort={{ field: 'index', order: 'ASC' }}
        pagination={false}
        component="div"
      >
         <TicketListContent />
      </List>
    </Box>
  );
};

export default TicketList;
