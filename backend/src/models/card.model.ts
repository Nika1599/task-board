import mongoose, { Document, Schema } from 'mongoose';

interface ICard extends Document {
  title: string;
  description: string;
  column: 'todo' | 'inProgress' | 'done';
  boardId: mongoose.Schema.Types.ObjectId;
}

const CardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    column: {
      type: String,
      column: {
        type: String,
        enum: ['ToDo', 'In Progress', 'Done'],
        required: true,
      },
      required: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
  },
  { timestamps: true },
);

const Card = mongoose.model<ICard>('Card', CardSchema);

export default Card;
