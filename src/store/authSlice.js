import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// ✅ Thunk xử lý đăng nhập và lưu token vào Redux
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/public/sign-in",
        formData,
        { withCredentials: true }
      );

      const data = response.data;

      return { token: data.accessToken, refreshToken: data.refreshToken };
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.errorMessage || "Login failed";

      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Thunk xử lý refresh token
export const refreshTokenUser = createAsyncThunk(
  "auth/refreshTokenUser",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/public/refresh-token",
        { refreshToken },
        { withCredentials: true }
      );

      return {
        token: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.errorMessage ||
        "Refresh Token failed";

      return rejectWithValue(errorMessage);
    }
  }
);

// Hàm lấy token từ cookie
const getTokenFromCookie = () => {
  return Cookies.get("token") || null;
};

// Hàm decode token để lấy thông tin user
const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const token = getTokenFromCookie();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: token ? decodeToken(token) : null,
    refreshToken: Cookies.get("refreshToken") || null,
    token: token,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
    },
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = decodeToken(action.payload.token);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = decodeToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshTokenUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        Cookies.set("token", action.payload.token, { expires: 7 });
        Cookies.set("refreshToken", action.payload.refreshToken, {
          expires: 7,
        });
      })
      .addCase(refreshTokenUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, login, updateUser } = authSlice.actions;
export default authSlice.reducer;
