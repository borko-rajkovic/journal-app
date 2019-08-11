import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DateScalar } from '../common/scalars/date.scalar';
import { UserSchema } from './schema/users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService, DateScalar],
  exports: [UsersService],
})
export class UsersModule {}
