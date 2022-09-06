import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../../app/store";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";
interface UserState {
  id: string;
  name: string;
}

const initialState: UserState[] = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await axios.get(USERS_URL);
  return res.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
