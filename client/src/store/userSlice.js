import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  loginUserGoogle,
  loginUserFacebook,
  getInformationUser,
  changePasswordUser,
  updatePhone,
  checkUrlToken,
  forgotPassword,
  resetPassword,
} from "../utils/api/userApi";

export const getAllUser = createAsyncThunk("user/getAllUser", async () => {
  return getAllUsers();
});

export const updateUserStatus = createAsyncThunk(
  "user/updateUser",
  async ({ id, status }) => {
    return updateUser(id, status);
  }
);

export const register = createAsyncThunk("user/register", async (userData) => {
  return registerUser(userData);
});

export const login = createAsyncThunk("user/login", async (userData) => {
  return loginUser(userData);
});

export const loginGoogle = createAsyncThunk(
  "user/loginGoogle",
  async (token) => {
    return loginUserGoogle(token);
  }
);

export const loginFacebook = createAsyncThunk(
  "user/loginFacebook",
  async (token) => {
    return loginUserFacebook(token);
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ id, oldPassword, newPassword }) => {
    return changePasswordUser(id, oldPassword, newPassword);
  }
);

export const updatePhoneUser = createAsyncThunk(
  "user/updatePhone",
  async ({ id, phone }) => {
    return updatePhone(id, phone);
  }
);

export const checkUrlPage = createAsyncThunk(
  "user/checkUrlPage",
  async ({ token }) => {
    return checkUrlToken(token);
  }
);

export const getInformation = createAsyncThunk(
  "user/getInformation",
  async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    return getInformationUser(accessToken, refreshToken);
  }
);

export const forgotPasswordUser = createAsyncThunk(
  "user/forgotPassword",
  async (email) => {
    return forgotPassword(email);
  }
);

export const resetPasswordUser = createAsyncThunk(
  "user/resetPassword",
  async ({ id, password }) => {
    return resetPassword(id, password);
  }
);

const initialState = {
  user: null,
  userAll: [],
  userResetPassword: null,
  userAllStatus: "idle",
  registerStatus: "idle",
  loginStatus: "idle",
  getInfoStatus: "idle",
  changePasswordStatus: "idle",
  updatePhoneStatus: "idle",
  checkUrlPageStatus: "idle",
  forgotPasswordStatus: "idle",
  resetPasswordStatus: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.registerStatus = "idle";
      state.loginStatus = "idle";
      state.getInfoStatus = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all user
      .addCase(getAllUser.pending, (state) => {
        state.userAllStatus = "loading";
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.userAllStatus = "succeeded";
        state.userAll = action.payload;
      })

      // Update user
      .addCase(updateUserStatus.pending, (state) => {
        state.userAllStatus = "loading";
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.userAllStatus = "succeeded";
        state.userAll = state.userAll.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })

      // Update phone
      .addCase(updatePhoneUser.pending, (state) => {
        state.updatePhoneStatus = "loading";
      })
      .addCase(updatePhoneUser.fulfilled, (state, action) => {
        state.updatePhoneStatus = "succeeded";
        state.user.phone = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.registerStatus = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerStatus = "succeeded";
        state.userAll.push(action.payload);
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.error = action.error.message;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      })

      // Login Google
      .addCase(loginGoogle.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      })

      // Login Facebook
      .addCase(loginFacebook.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(loginFacebook.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(loginFacebook.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      })

      // Get information
      .addCase(getInformation.pending, (state) => {
        state.getInfoStatus = "loading";
      })
      .addCase(getInformation.fulfilled, (state, action) => {
        state.getInfoStatus = "succeeded";
        state.user = action.payload;
        // state.error = null;
      })
      .addCase(getInformation.rejected, (state) => {
        state.getInfoStatus = "failed";
        // state.error = action.error.message;
      })

      // Reset password
      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = "loading";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordStatus = "succeeded";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordStatus = "failed";
        state.error = action.error.message;
      })

      // Check url page
      .addCase(checkUrlPage.pending, (state) => {
        state.checkUrlPageStatus = "loading";
      })
      .addCase(checkUrlPage.fulfilled, (state, action) => {
        state.checkUrlPageStatus = "succeeded";
        state.userResetPassword = action.payload;
        state.error = null;
      })
      .addCase(checkUrlPage.rejected, (state) => {
        state.checkUrlPageStatus = "failed";
      })

      // Forgot password
      .addCase(forgotPasswordUser.pending, (state) => {
        state.forgotPasswordStatus = "loading";
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.forgotPasswordStatus = "succeeded";
        state.error = null;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.forgotPasswordStatus = "failed";
        state.error = action.error.message;
      })

      // Reset password
      .addCase(resetPasswordUser.pending, (state) => {
        state.resetPasswordStatus = "loading";
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.resetPasswordStatus = "succeeded";
        state.error = null;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.resetPasswordStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
