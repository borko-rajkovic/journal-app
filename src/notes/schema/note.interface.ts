import { Document } from 'mongoose';

export interface Note extends Document {
  userId: string;
  title: string;
  body: string;
  createdDate: Date;
  updatedDate: Date;
}
