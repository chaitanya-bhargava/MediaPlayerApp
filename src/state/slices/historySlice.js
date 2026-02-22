import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHistory } from "../../services/firestore";

export const fetchHistory = createAsyncThunk(
  "history/fetch",
  async (userId) => {
    return await getHistory(userId);
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default historySlice.reducer;
