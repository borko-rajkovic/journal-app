import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';

import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.get('db'), { useNewUrlParser: true }),
    GraphQLModule.forRoot({
      introspection: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      playground: true,
      uploads: { maxFileSize: 10000000, maxFiles: 1 },
    }),
    NotesModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
