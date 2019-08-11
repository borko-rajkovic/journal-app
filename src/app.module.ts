import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import * as config from 'config';

@Module({
  imports: [
    MongooseModule.forRoot(config.get('db'), { useNewUrlParser: true }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      playground: true,
    }),
    NotesModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
