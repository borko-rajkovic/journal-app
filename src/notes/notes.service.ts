import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EditNoteInput } from './dto/edit-note.input';
import { NewNoteInput } from './dto/new-note.input';
import { NotesArgs } from './dto/notes.args';
import { Note } from './schema/note.interface';

@Injectable()
export class NotesService {
  constructor(@InjectModel('Note') private readonly noteModel: Model<Note>) {}

  async create(data: NewNoteInput, user: any): Promise<Note> {
    const createdNote = new this.noteModel(data);
    createdNote.userId = user.id;
    const newNote = await createdNote.save();
    return newNote;
  }

  async edit(data: EditNoteInput): Promise<Note> {
    const note = await this.noteModel.findById(data.id).exec();
    if (!note) {
      throw new Error('Note not found');
    }

    if (data.body) {
      note.body = data.body;
    }

    if (data.title) {
      note.title = data.title;
    }

    note.updatedDate = new Date();

    const updatedNote = await note.save();
    return updatedNote;
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
