import { Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalar';
import { NotesResolver } from './notes.resolver';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './notes.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }])],
  providers: [NotesResolver, NotesService, DateScalar],
})
export class NotesModule {}
