export interface Board {
  _id: string;
  name: string;
}

export interface Card {
  _id: string;
  boardId: string;
  title: string;
  description: string;
  column: "ToDo" | "InProgress" | "Done";
}

export interface BoardState {
  board: Board | null;
  loading: boolean;
  error: string | null;
}

export interface CardState {
  cards: Card[];
  loading: boolean;
  error: string | null;
}
