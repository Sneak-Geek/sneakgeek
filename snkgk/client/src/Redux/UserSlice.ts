import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    updateUser: () => ({
      user: null,
      isAuthenticated: true,
    }),
  },
});

export const {updateUser} = userSlice.actions;

export const userReducer = userSlice.reducer;
