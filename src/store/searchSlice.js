import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk để fetch danh sách districts
export const fetchDistricts = createAsyncThunk(
  "search/fetchDistricts",
  async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/districts`
    );
    return await response.json();
  }
);

// Thunk để fetch danh sách amenities
export const fetchAmenities = createAsyncThunk(
  "search/fetchAmenities",
  async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/amenities`
    );
    return await response.json();
  }
);

// Tạo thunk để fetch danh sách hotels
export const fetchHotels = createAsyncThunk(
  "search/fetchHotels",
  async (params) => {
    const response = await fetch(params);
    if (!response.ok) {
      const errorDetail = await response.text(); // Lấy chi tiết lỗi
      throw new Error(`Failed to fetch hotels: ${errorDetail}`);
    }
    return await response.json();
  }
);

const initialState = {
  query: {
    districtId: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    startDate: "",
    endDate: "",
    amenityNames: [],
    sortBy: "id",
    sortOrder: "asc",
  },
  districts: [],
  amenities: [], // Thêm trạng thái để lưu amenities
  hotels: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = { ...state.query, ...action.payload };
    },
    clearQuery: (state) => {
      state.query = initialState.query;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        state.districts = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch districts";
      })
      .addCase(fetchAmenities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.loading = false;
        state.amenities = action.payload; // Lưu danh sách amenities vào state
      })
      .addCase(fetchAmenities.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch amenities";
      })
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
        // Cập nhật danh sách hotels ở đây nếu cần
      })
      .addCase(fetchHotels.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch hotels";
      });
  },
});

export const { setQuery, clearQuery } = searchSlice.actions;
export default searchSlice.reducer;
