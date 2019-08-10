import { Document } from 'mongoose';

export interface Note extends Document {
  readonly authorId: number;
  readonly title: string;
  readonly body: string;
  readonly createdDate: Date;
}
