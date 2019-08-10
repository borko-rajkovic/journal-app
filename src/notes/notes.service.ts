import { Injectable } from '@nestjs/common';
import { NewNoteInput } from './dto/new-note.input';
import { NotesArgs } from './dto/notes.args';
import { Note } from './interfaces/note.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotesService {
  constructor(@InjectModel('Note') private readonly noteModel: Model<Note>) {}

  async create(data: NewNoteInput): Promise<Note> {
    const createdNote = new this.noteModel(data);
    const newNote = await createdNote.save();
    return newNote;
  }

  async findOneById(id: string): Promise<Note> {
    return await this.noteModel.findOne({ _id: id }).exec();
  }

  async findAll(notesArgs: NotesArgs): Promise<Note[]> {
    const { skip, take } = notesArgs;
    return await this.noteModel.find().exec();
  }

  async remove(id: string): Promise<boolean> {
    await this.noteModel.findOneAndRemove(id);
    return true;
  }
}
