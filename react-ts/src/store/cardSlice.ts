import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";
import { Card } from "../types/types";

const API_URL = "http://localhost:5000/api/cards";

const handleAxiosError = (error: unknown): string => {
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError.response?.data?.message || "Unknown error occurred";
};

// Отримати всі картки для конкретного борду
export const fetchCards = createAsyncThunk<
  Card[],
  string,
  { rejectValue: string }
>("cards/fetchCards", async (boardId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}?boardId=${boardId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

// Створити нову картку
export const createCard = createAsyncThunk<
  Card,
  { boardId: string; title: string; description: string; column: string },
  { rejectValue: string }
>(
  "cards/createCard",
  async ({ boardId, title, description, column }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, {
        boardId,
        title,
        description,
        column,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

// Оновити картку
export const updateCard = createAsyncThunk<
  Card,
  { cardId: string; updates: Partial<Card> },
  { rejectValue: string }
>("cards/updateCard", async ({ cardId, updates }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${cardId}`, updates);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

// Видалити картку
export const deleteCard = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("cards/deleteCard", async (cardId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${cardId}`);
    return cardId;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

interface CardsState {
  cards: Card[];
  loading: boolean;
  error: string | null;
}

const initialState: CardsState = {
  cards: JSON.parse(localStorage.getItem("cards") || "[]"),
  loading: false,
  error: null,
};

const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cards
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
        localStorage.setItem("cards", JSON.stringify(action.payload)); // Зберігаємо у localStorage
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch cards";
      })

      // Create Card
      .addCase(createCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.loading = false;
        state.cards.push(action.payload);
        localStorage.setItem("cards", JSON.stringify(state.cards)); // Оновлюємо localStorage
      })
      .addCase(createCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create card";
      })

      // Update Card
      .addCase(updateCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = state.cards.map((card) =>
          card._id === action.payload._id ? action.payload : card
        );
        localStorage.setItem("cards", JSON.stringify(state.cards)); // Оновлюємо localStorage
      })
      .addCase(updateCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update card";
      })

      // Delete Card
      .addCase(deleteCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = state.cards.filter((card) => card._id !== action.payload);
        localStorage.setItem("cards", JSON.stringify(state.cards)); // Оновлюємо localStorage
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete card";
      });
  },
});

export const cardReducer = cardSlice.reducer;
