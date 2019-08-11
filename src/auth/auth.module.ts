import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';

import { DateScalar } from '../common/scalars/date.scalar';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.get('jwtPrivateKey'),
      signOptions: { expiresIn: '2 days' },
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthResolver, DateScalar],
  exports: [AuthService],
})
export class AuthModule {}
