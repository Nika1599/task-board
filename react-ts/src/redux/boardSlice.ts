import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Board {
  id: string;
  name: string;
  columns: {
    todo: Card[];
    inProgress: Card[];
    done: Card[];
  };
}

interface BoardState {
  boards: Board[];
}

const initialState: BoardState = {
  boards: [],
};

const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(
        (board) => board.id === action.payload.id
      );
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(
        (board) => board.id !== action.payload
      );
    },
    addCard: (
      state,
      action: PayloadAction<{ boardId: string; column: string; card: Card }>
    ) => {
      const { boardId, column, card } = action.payload;
      const board = state.boards.find((board) => board.id === boardId);
      if (board) {
        board.columns[column as keyof typeof board.columns].push(card);
      }
    },
    updateCard: (
      state,
      action: PayloadAction<{ boardId: string; column: string; card: Card }>
    ) => {
      const { boardId, column, card } = action.payload;
      const board = state.boards.find((board) => board.id === boardId);
      if (board) {
        const columnCards = board.columns[column as keyof typeof board.columns];
        const cardIndex = columnCards.findIndex((c) => c.id === card.id);
        if (cardIndex !== -1) {
          columnCards[cardIndex] = card;
        }
      }
    },
    deleteCard: (
      state,
      action: PayloadAction<{ boardId: string; column: string; cardId: string }>
    ) => {
      const { boardId, column, cardId } = action.payload;
      const board = state.boards.find((board) => board.id === boardId);
      if (board) {
        board.columns[column as keyof typeof board.columns] = board.columns[
          column as keyof typeof board.columns
        ].filter((c) => c.id !== cardId);
      }
    },
  },
});

export const {
  setBoards,
  addBoard,
  updateBoard,
  deleteBoard,
  addCard,
  updateCard,
  deleteCard,
} = boardSlice.actions;

export default boardSlice.reducer;
