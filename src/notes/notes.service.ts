import { Injectable, NotFoundException } from '@nestjs/common';
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

  async edit(data: EditNoteInput, user: any): Promise<Note> {
    const note = await this.noteModel
      .findOne({ _id: data.id, userId: user.id })
      .exec();
    if (!note) {
      throw new NotFoundException();
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

  async findOneById(id: string, user: any): Promise<Note> {
    return await this.noteModel.findOne({ _id: id, userId: user.id }).exec();
  }

  async findAll(notesArgs: NotesArgs, user: any): Promise<Note[]> {
    const { skip, take } = notesArgs;
    let query = this.noteModel.find({ userId: user.id }).skip(skip);
    if (take) {
      query = query.limit(take);
    }
    return await query.exec();
  }

  async remove(id: string, user: any): Promise<boolean> {
    await this.noteModel.deleteOne({ _id: id, userId: user.id }).exec();
    return true;
  }
}
