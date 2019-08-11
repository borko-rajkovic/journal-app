import { Document } from 'mongoose';

export interface Note extends Document {
  readonly userId: string;
  readonly title: string;
  readonly body: string;
  readonly createdDate: Date;
}
