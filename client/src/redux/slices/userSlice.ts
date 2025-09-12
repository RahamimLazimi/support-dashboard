import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '@/api/users';
import { User } from '@/types';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// thunk לשליפת כל המשתמשים
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getAllUsers();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// thunk לעדכון תפקיד משתמש
export const updateUserRole = createAsyncThunk<
  { userId: string; role: string },
  { userId: string; role: string },
  { rejectValue: string }
>('users/updateRole', async ({ userId, role }, { rejectWithValue }) => {
  try {
    await api.updateUserRole(userId, role);
    return { userId, role };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      .addCase(updateUserRole.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          user.roles = [role];
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update user role';
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
