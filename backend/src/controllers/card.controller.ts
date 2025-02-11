import { Request, Response } from 'express';
import Card from '../models/card.model';

export const getCardsByBoardId = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.query;
    if (!boardId) {
      return res.status(400).json({ message: 'Board ID is required' });
    }

    const cards = await Card.find({ boardId });
    res.json(cards);
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Something went wrong',
    });
  }
};
export const createCard = async (req: Request, res: Response) => {
  try {
    const { title, description, column, boardId } = req.body;

    const newCard = new Card({
      title,
      description,
      column,
      boardId,
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { title, description, column } = req.body;

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (title) card.title = title;
    if (description) card.description = description;
    if (column) card.column = column;

    await card.save();
    res.json(card);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
