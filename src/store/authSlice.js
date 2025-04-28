import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Thunk xử lý đăng nhập và lưu token vào Redux và Cookies
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/public/sign-in`,
        formData,
        { withCredentials: true }
      );
      const data = response.data;
      // Lưu token và refreshToken vào cookies khi đăng nhập thành công
      Cookies.set("token", data.accessToken, { expires: 7, path: "/" });
      Cookies.set("refreshToken", data.refreshToken, { expires: 7, path: "/" });
      return { token: data.accessToken, refreshToken: data.refreshToken };
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.errorMessage || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Thunk xử lý hoàn tất đăng nhập GitHub
export const completeGithubLogin = createAsyncThunk(
  "auth/completeGithubLogin",
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/public/login/oauth2/code/github?code=${code}`, // Gửi mã code như tham số
        {}, // Body có thể để trống
        { withCredentials: true }
      );
      const data = response.data;

      // Lưu token và refreshToken vào cookies
      Cookies.set("token", data.accessToken, { expires: 7, path: "/" });
      Cookies.set("refreshToken", data.refreshToken, { expires: 7, path: "/" });

      return { token: data.accessToken, refreshToken: data.refreshToken };
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.errorMessage ||
        "GitHub login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Thunk xử lý hoàn tất đăng nhập Google (tương tự GitHub)
export const completeGoogleLogin = createAsyncThunk(
  "auth/completeGoogleLogin",
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/public/login/oauth2/code/google?code=${code}`, // Endpoint cho Google
        {},
        { withCredentials: true }
      );
      const data = response.data;

      // Lưu token và refreshToken vào cookies
      Cookies.set("token", data.accessToken, { expires: 7, path: "/" });
      Cookies.set("refreshToken", data.refreshToken, { expires: 7, path: "/" });

      return { token: data.accessToken, refreshToken: data.refreshToken };
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.errorMessage ||
        "Google login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Thunk xử lý refresh token và cập nhật Cookies
export const refreshTokenUser = createAsyncThunk(
  "auth/refreshTokenUser",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/public/refresh-token`,
        { refreshToken },
        { withCredentials: true }
      );
      const data = response.data;
      // Cập nhật token và refreshToken trong cookies khi refresh thành công
      Cookies.set("token", data.accessToken, { expires: 7, path: "/" });
      Cookies.set("refreshToken", data.refreshToken, { expires: 7, path: "/" });
      return { token: data.accessToken, refreshToken: data.refreshToken };
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
// Hàm lấy refreshToken từ cookie
const getRefreshTokenFromCookie = () => {
  return Cookies.get("refreshToken") || null;
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

// Khởi tạo state từ cookies
const token = getTokenFromCookie();
const refreshToken = getRefreshTokenFromCookie();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: token ? decodeToken(token) : null,
    refreshToken: refreshToken,
    token: token,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
    },
    login: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
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
        // Token và refreshToken đã được lưu vào cookie trong thunk
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshTokenUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        // Token và refreshToken đã được cập nhật trong cookie trong thunk
      })
      .addCase(refreshTokenUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(completeGithubLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeGithubLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = decodeToken(action.payload.token);
      })
      .addCase(completeGithubLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Thêm các case cho completeGoogleLogin
      .addCase(completeGoogleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeGoogleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = decodeToken(action.payload.token);
      })
      .addCase(completeGoogleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, login, updateUser } = authSlice.actions;
export default authSlice.reducer;
