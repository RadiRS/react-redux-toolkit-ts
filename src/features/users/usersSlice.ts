import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface UserState {
  id: string;
  name: string;
}

const initialState: UserState[] = [
  {
    id: "0",
    name: "Dude Levbo",
  },
  {
    id: "1",
    name: "Petrus Wai",
  },
  {
    id: "3",
    name: "Budi Low",
  },
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
