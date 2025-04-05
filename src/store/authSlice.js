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

      return { token: data.accessToken };
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.errorMessage || "Login failed";

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
const user = token ? decodeToken(token) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user,
    token,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("token", { path: "/" });
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
        state.user = decodeToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, login, updateUser } = authSlice.actions;
export default authSlice.reducer;
