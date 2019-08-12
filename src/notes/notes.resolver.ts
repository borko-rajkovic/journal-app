import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { EditNoteInput } from './dto/edit-note.input';
import { NewNoteInput } from './dto/new-note.input';
import { NoteType } from './dto/note.dto';
import { NotesArgs } from './dto/notes.args';
import { NotesService } from './notes.service';
import { Note } from './schema/note.interface';
import { GqlAuthGuard } from '../users/gql.auth.guard';
import { CurrentUser } from '../users/user.decorator';

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
  @UseGuards(GqlAuthGuard)
  async addNote(
    @Args('newNoteData') newNoteData: NewNoteInput,
    @CurrentUser() user: any,
  ): Promise<Note> {
    const note = await this.notesService.create(newNoteData, user);
    return note;
  }

  @Mutation(returns => NoteType)
  async editNote(
    @Args('updatedNoteData') updatedNoteData: EditNoteInput,
  ): Promise<Note> {
    const note = await this.notesService.edit(updatedNoteData);
    return note;
  }

  @Mutation(returns => Boolean)
  async removeNote(@Args('id') id: string) {
    return this.notesService.remove(id);
  }
}
