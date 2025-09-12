import { configureStore } from '@reduxjs/toolkit';

import ticketReducer from './slices/ticketSlice';
import authReducer from './slices/authSlice';
import usersReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    tickets: ticketReducer,
    auth: authReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
