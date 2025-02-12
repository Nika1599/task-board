import axios from "axios";
import { Board } from "../types/types.ts";

const API_URL = "http://localhost:5000/api/boards";

export const fetchBoardById = async (boardId: string): Promise<Board> => {
  const response = await axios.get(`${API_URL}/${boardId}`);
  return response.data;
};

export const createBoard = async (name: string): Promise<Board> => {
  const response = await axios.post(API_URL, { name });
  return response.data;
};

export const deleteBoard = async (boardId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${boardId}`);
};
