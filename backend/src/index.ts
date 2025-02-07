import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { getEnvVar } from './utils/getEnvVar';
import { initMongoDB } from './config/db';
import boardRoutes from './routes/board.routes';
import cardRoutes from './routes/card.routes';

const app = express();
const PORT = Number(getEnvVar('PORT', '5000'));

app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', false);
initMongoDB();
app.use('/api/boards', boardRoutes);
app.use('/api/cards', cardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
