import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCards } from "../../services/firestore";

export const fetchCards = createAsyncThunk(
  "cards/fetch",
  async ({ userId, bucketId }) => {
    const cards = await getCards(userId, bucketId);
    return { bucketId, cards };
  }
);

const cardsSlice = createSlice({
  name: "cards",
  initialState: { byBucket: {}, loading: {}, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state, action) => {
        state.loading[action.meta.arg.bucketId] = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        const { bucketId, cards } = action.payload;
        state.byBucket[bucketId] = cards;
        state.loading[bucketId] = false;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading[action.meta.arg.bucketId] = false;
        state.error = action.error.message;
      });
  },
});

export default cardsSlice.reducer;
