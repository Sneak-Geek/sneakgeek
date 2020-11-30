import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type User = {
  displayName?: string;
  email?: string;
  emailVerified?: string;
  isAnonymous: boolean;
  phoneNumber?: string;
  providerId: string;
  uid: string;
};

export type UserState = {
  user?: User;
  isAuthenticated: boolean;
  token: string;
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: undefined,
    isAuthenticated: false,
    token: '',
  } as UserState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => ({
      ...state,
      user: action.payload,
      isAuthenticated: action.payload !== undefined,
    }),
  },
});

export const {updateUser} = userSlice.actions;

export const userReducer = userSlice.reducer;
