import { configureStore } from '@reduxjs/toolkit';
import searchReducer from "./searchSlice"

const store = configureStore({
  reducer: {
    search: searchReducer, // Kết hợp reducer
  },
});

export default store;