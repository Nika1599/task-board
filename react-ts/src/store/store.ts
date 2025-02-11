import { configureStore } from "@reduxjs/toolkit";
import { boardReducer } from "./boardSlice";
import { cardReducer } from "./cardSlice";

export const store = configureStore({
  reducer: { board: boardReducer, card: cardReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
