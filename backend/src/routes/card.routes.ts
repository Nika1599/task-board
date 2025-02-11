import { Router } from 'express';
import {
  getCardsByBoardId,
  createCard,
  updateCard,
  deleteCard,
} from '../controllers/card.controller';

const router = Router();

router.get('/', getCardsByBoardId);
router.post('/', createCard);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;
