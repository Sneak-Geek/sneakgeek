import {configureStore} from '@reduxjs/toolkit';
import {userReducer} from './UserSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
  },
});

export default store;
