import { configureStore } from "@reduxjs/toolkit";
import { boardReducer } from "./boardSlice.ts";
import { cardReducer } from "./cardSlice.ts";

export const store = configureStore({
  reducer: { board: boardReducer, card: cardReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
