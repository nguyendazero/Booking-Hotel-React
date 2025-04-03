import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk để fetch danh sách districts
export const fetchDistricts = createAsyncThunk(
  "search/fetchDistricts",
  async () => {
    const response = await fetch(
      "http://localhost:8080/api/v1/public/districts"
    );
    return await response.json();
  }
);

// Thunk để fetch danh sách amenities
export const fetchAmenities = createAsyncThunk(
  "search/fetchAmenities",
  async () => {
    const response = await fetch(
      "http://localhost:8080/api/v1/public/amenities"
    );
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
    amenityNames: [],  // Thêm vào đây
  },
  districts: [],
  amenities: [], // Thêm trạng thái để lưu amenities
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
      });
  },
});

export const { setQuery, clearQuery } = searchSlice.actions;
export default searchSlice.reducer;