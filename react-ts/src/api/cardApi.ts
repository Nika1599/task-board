import axios from "axios";
import { Card } from "../types/types.ts";

const API_URL = "http://localhost:5000/api/cards";

export const createCard = async (card: Omit<Card, "id">): Promise<Card> => {
  const response = await axios.post(API_URL, card);
  return response.data;
};

export const updateCard = async (card: Card): Promise<Card> => {
  const response = await axios.put(`${API_URL}/${card._id}`, card);
  return response.data;
};

export const deleteCard = async (cardId: string): Promise<void> => {
  await axios.delete(`${API_URL}/${cardId}`);
};
