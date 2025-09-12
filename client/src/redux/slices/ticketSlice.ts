import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import * as api from '@/api';

import { Ticket } from '@/types';

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  loading: false,
  error: null,
};

export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await api.getAllTickets();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const createTicket = createAsyncThunk(
  'tickets/create',
  async (data: Partial<Ticket>, { rejectWithValue }) => {
    try {
      return await api.createTicket(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    updateStatus: (
      state,
      action: PayloadAction<{ ticketId: string; newStatus: Ticket['status'] }>,
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.ticketId);
      if (ticket) {
        ticket.status = action.payload.newStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        state.tickets.unshift(action.payload);
      });
  },
});

export default ticketSlice.reducer;
export const { updateStatus } = ticketSlice.actions;
