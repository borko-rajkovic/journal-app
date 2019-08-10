import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { NewNoteInput } from './dto/new-note.input';
import { NotesArgs } from './dto/notes.args';
import { Note } from './schema/note.interface';
import { NotesService } from './notes.service';
import { NoteType } from './dto/note.dto';

@Resolver()
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Query(returns => NoteType)
  async note(@Args('id') id: string): Promise<Note> {
    const note = await this.notesService.findOneById(id);
    if (!note) {
      throw new NotFoundException(id);
    }
    return note;
  }

  @Query(returns => [NoteType])
  notes(@Args() notesArgs: NotesArgs): Promise<Note[]> {
    return this.notesService.findAll(notesArgs);
  }

  @Mutation(returns => NoteType)
  async addNote(@Args('newNoteData') newNoteData: NewNoteInput): Promise<Note> {
    const note = await this.notesService.create(newNoteData);
    return note;
  }

  @Mutation(returns => Boolean)
  async removeNote(@Args('id') id: string) {
    return this.notesService.remove(id);
  }
}
