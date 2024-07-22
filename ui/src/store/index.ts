import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth";
import uiSlice from "./slices/ui";
import selectSlice from "./slices/selects";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    select: selectSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
