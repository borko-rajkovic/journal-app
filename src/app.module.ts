import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';

import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.get('db'), { useNewUrlParser: true }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
    NotesModule,
  ],
})
export class AppModule {}
