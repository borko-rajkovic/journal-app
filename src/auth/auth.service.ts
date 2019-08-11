import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserInput } from '../users/dto/new-user.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userData: UserInput): Promise<any> {
    const user = await this.usersService.findOneByUsername(userData.username);

    if (!user) {
      return null;
    }

    const validPassword = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!validPassword) {
      return null;
    }

    return {
      username: user.username,
      createdDate: user.createdDate,
      id: user._id,
    };
  }

  async login(user: UserInput) {
    const userValid = await this.validateUser(user);
    if (!userValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      username: userValid.username,
      sub: userValid.id,
      createdDate: userValid.createdDate,
    };

    return this.jwtService.sign(payload);
  }
}
