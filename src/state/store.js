import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bucketsReducer from "./slices/bucketsSlice";
import cardsReducer from "./slices/cardsSlice";
import historyReducer from "./slices/historySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    buckets: bucketsReducer,
    cards: cardsReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
