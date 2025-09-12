import { useEffect } from 'react';
import { Typography, CircularProgress, Alert, Box, Grid } from '@mui/material';

import { useAppDispatch, useAppSelector, fetchTickets, fetchUsers } from '@/redux';

import { TicketItem } from '..';
import { Ticket } from '@/types';
import { t } from 'i18next';
import { selectAgents, selectIsAdmin } from '@/redux/selectors/users';

interface TicketListProps {
  tickets?: Ticket[]; // אם לא יועברו טיקטים, יקרא מה־redux
}

export default function TicketList({ tickets }: TicketListProps) {
  const dispatch = useAppDispatch();
  const { tickets: allTickets, loading, error } = useAppSelector((state) => state.tickets);

  // טען את כל הטיקטים
  const displayedTickets = allTickets ?? tickets;

  const agents = useAppSelector(selectAgents);
  const isAdmin = useAppSelector(selectIsAdmin);

  useEffect(() => {
    if (isAdmin && agents.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isAdmin, agents.length]);

  useEffect(() => {
    if (!tickets) dispatch(fetchTickets());
  }, [dispatch, tickets]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  if (displayedTickets.length === 0) return <Typography>{t('tickets.noTickets')}.</Typography>;

  return (
    displayedTickets && (
      <Box>
        <Grid container spacing={2} alignItems="stretch">
          {displayedTickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={6} key={ticket.id}>
              <TicketItem ticket={ticket} agents={agents} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  );
}
