import mongoose, { Document, Schema } from 'mongoose';

interface IBoard extends Document {
  name: string;
  columns: {
    todo: string[];
    inProgress: string[];
    done: string[];
  };
}

const BoardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    columns: {
      todo: { type: [String], default: [] },
      inProgress: { type: [String], default: [] },
      done: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Board = mongoose.model<IBoard>('Board', BoardSchema);

export default Board;
