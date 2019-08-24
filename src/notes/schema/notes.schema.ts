import * as mongoose from 'mongoose';

export const NoteSchema = new mongoose.Schema({
  userId: String,
  title: String,
  body: String,
  attachment: String,
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});
