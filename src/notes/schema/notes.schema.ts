import * as mongoose from 'mongoose';

export const NoteSchema = new mongoose.Schema({
  authorId: Number,
  title: String,
  body: String,
  createdDate: { type: Date, default: Date.now },
});
