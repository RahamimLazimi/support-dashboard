import { RootState } from '@/redux';

export const selectAgents = (state: RootState) => {
  return state.users.users.filter((u) => u.roles.includes('Agent'));
};

export const selectCurrentAgent = (state: RootState) => {
  if (state.auth?.user?.roles?.includes('Agent')) {
    return state.auth?.user;
  }
};

export const selectIsAdmin = (state: RootState) => state.auth.user?.roles?.includes('Admin');
