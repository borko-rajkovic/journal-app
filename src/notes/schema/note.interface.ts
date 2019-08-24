import { Document } from 'mongoose';

export interface Note extends Document {
  userId: string;
  title: string;
  body: string;
  attachment: string;
  createdDate: Date;
  updatedDate: Date;
}
