import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; // Import js-cookie
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

      if (!response.status === 200) {
        throw new Error(data.errors.errorMessage || "Login failed");
      }

      // Lưu token vào Redux và cookies
      Cookies.set("token", data.accessToken, { expires: 7, path: "/" });
      return { token: data.accessToken };
    } catch (error) {
      console.error("🔴 API Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Thunk xử lý lấy thông tin người dùng
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth; // Lấy token từ Redux

    if (!token) {
      throw new Error("Token is not available");
    }

    try {
      const response = await axios.get("http://localhost:8080/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${token}`, // Đính token vào header
        },
        withCredentials: true, // Đảm bảo cookie được gửi
      });

      return response.data;
    } catch (error) {
      console.error("🔴 API Error:", error.message);
      return rejectWithValue(null); // Trả về null nếu không có thông tin user
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
    return jwtDecode(token); // Decode token để lấy thông tin user
  } catch (error) {
    console.error("Invalid token:", error);
    return null; // Nếu token không hợp lệ, trả về null
  }
};

// Lấy token từ cookie và giải mã để lấy user
const token = getTokenFromCookie();
const user = token ? decodeToken(token) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user, // Thông tin user được giải mã từ token
    token, // Token từ cookie
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null; // Xóa token khi logout
      Cookies.remove("token", { path: "/" }); // Xóa token khỏi cookies
    },
    login: (state, action) => {
      state.token = action.payload.token; // Lưu token khi đăng nhập thành công
      state.user = decodeToken(action.payload.token); // Decode và lưu thông tin user
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
        state.token = action.payload.token; // Lưu token vào state
        state.user = decodeToken(action.payload.token); // Decode và lưu thông tin user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Lưu thông tin user từ API nếu cần
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;
