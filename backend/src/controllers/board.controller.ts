import { Request, Response } from 'express';
import Board from '../models/board.model';

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newBoard = new Board({
      name,
      columns: {
        todo: [],
        inProgress: [],
        done: [],
      },
    });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const getBoardById = async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json(board);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { name, columns } = req.body;

    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (name) board.name = name;
    if (columns) board.columns = columns;

    await board.save();
    res.json(board);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
