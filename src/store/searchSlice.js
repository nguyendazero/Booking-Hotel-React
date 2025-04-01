import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '', // Trạng thái mặc định cho truy vấn tìm kiếm
};

const searchSlice = createSlice({
  name: 'search', // Tên của slice
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload; // Cập nhật truy vấn
    },
    clearQuery: (state) => {
      state.query = ''; // Xóa truy vấn
    },
  },
});

export const { setQuery, clearQuery } = searchSlice.actions;

export default searchSlice.reducer;