import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLogin: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    showLoginForm: (state) => {
      state.showLogin = true;
    },
    hidenLoginForm: (state) => {
      state.showLogin = false;
    },
  },
});

export const { showLoginForm, hidenLoginForm } = loginSlice.actions;
export default loginSlice.reducer;
