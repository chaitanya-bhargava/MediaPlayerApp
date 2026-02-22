import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBuckets } from "../../services/firestore";

export const fetchBuckets = createAsyncThunk(
  "buckets/fetch",
  async (userId) => {
    return await getBuckets(userId);
  }
);

const bucketsSlice = createSlice({
  name: "buckets",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuckets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuckets.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBuckets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bucketsSlice.reducer;
