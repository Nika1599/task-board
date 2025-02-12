import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";
import { Board } from "../types/types.ts";

const API_URL = "http://localhost:5000/api/boards";

const handleAxiosError = (error: unknown): string => {
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError.response?.data?.message || "Unknown error occurred";
};

export const fetchBoard = createAsyncThunk<
  Board,
  string,
  { rejectValue: string }
>("board/fetchBoard", async (boardId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${boardId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createBoard = createAsyncThunk<
  Board,
  string,
  { rejectValue: string }
>("board/createBoard", async (name, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, { name });
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteBoard = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("board/deleteBoard", async (boardId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${boardId}`);
    return boardId;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

interface BoardState {
  board: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  board: localStorage.getItem("board")
    ? JSON.parse(localStorage.getItem("board")!)
    : null,
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    // Екшн для скидання стану дошки
    resetBoard(state) {
      state.board = null; // скидаємо board в state
      localStorage.removeItem("board"); // видаляємо board з localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Board
      .addCase(fetchBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload;
        localStorage.setItem("board", JSON.stringify(action.payload)); // Зберігаємо у localStorage
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch board";
      })

      // Create Board
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.board = action.payload;
        localStorage.setItem("board", JSON.stringify(action.payload)); // Зберігаємо у localStorage
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create board";
      })

      // Delete Board
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.loading = false;
        if (state.board?._id === action.payload) {
          state.board = null;
          localStorage.removeItem("board"); // Видаляємо з localStorage
        }
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete board";
      });
  },
});

export const { resetBoard } = boardSlice.actions;
export const boardReducer = boardSlice.reducer;
