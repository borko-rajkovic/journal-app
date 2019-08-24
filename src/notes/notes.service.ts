import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as mkdirp from 'mkdirp';
import * as shortid from 'shortid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EditNoteInput } from './dto/edit-note.input';
import { NewNoteInput } from './dto/new-note.input';
import { NotesCountArgs } from './dto/notes-count.args';
import { NotesArgs } from './dto/notes.args';
import { Note } from './schema/note.interface';
import { ReadStream } from 'fs';

const UPLOAD_DIR = './uploads';

@Injectable()
export class NotesService {
  constructor(@InjectModel('Note') private readonly noteModel: Model<Note>) {}

  storeFS({
    stream,
    filename,
  }: {
    stream: ReadStream;
    filename: string;
  }): Promise<{ id: string; path: string }> {
    const id = shortid.generate();
    const path = `${UPLOAD_DIR}/${id}-${filename}`;
    return new Promise((resolve, reject) =>
      stream
        .on('error', error => {
          if ((stream as any).truncated) {
            // Delete the truncated file.
            fs.unlinkSync(path);
          }
          reject(error);
        })
        .pipe(fs.createWriteStream(path))
        .on('error', error => reject(error))
        .on('finish', () => resolve({ id, path })),
    );
  }

  async create(data: NewNoteInput, user: any): Promise<Note> {
    let attachment = '';
    if (data.file) {
      mkdirp.sync(UPLOAD_DIR);

      const result = await data.file;
      const { filename, createReadStream } = result;
      const stream = createReadStream();
      const { path } = await this.storeFS({ stream, filename });
      attachment = path;
    }
    const createdNote = new this.noteModel(data);
    createdNote.attachment = attachment;
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

    if (data.file) {
      mkdirp.sync(UPLOAD_DIR);

      const result = await data.file;
      const { filename, createReadStream } = result;
      const stream = createReadStream();
      const { path } = await this.storeFS({ stream, filename });
      note.attachment = path;
    }

    note.updatedDate = new Date();

    const updatedNote = await note.save();
    return updatedNote;
  }

  async findOneById(id: string, user: any): Promise<Note> {
    return await this.noteModel.findOne({ _id: id, userId: user.id }).exec();
  }

  async findAll(notesArgs: NotesArgs, user: any): Promise<Note[]> {
    const { skip, take, asc, query } = notesArgs;
    const sortDirection = asc ? 1 : -1;
    let where = { userId: user.id };
    if (query) {
      where = Object.assign({}, where, { title: new RegExp(query) });
    }

    let queryDB = this.noteModel.find(where).skip(skip);
    if (take) {
      queryDB = queryDB.limit(take);
    }
    queryDB = queryDB.sort({ updatedDate: sortDirection });
    return await queryDB.exec();
  }

  async count(user: any, args: NotesCountArgs): Promise<number> {
    let where = { userId: user.id };
    if (args) {
      where = Object.assign({}, where, { title: new RegExp(args.query) });
    }

    const queryDB = this.noteModel.countDocuments(where);
    return await queryDB.exec();
  }

  async remove(id: string, user: any): Promise<boolean> {
    await this.noteModel.deleteOne({ _id: id, userId: user.id }).exec();
    return true;
  }
}
