import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { UserInput } from './dto/new-user.input';
import { User } from './schema/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(data: UserInput): Promise<User> {
    const { username, password } = data;
    const userExist = await this.userModel.count({ username }).exec();

    if (userExist > 0) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUserData = {
      username,
      password: hashPassword,
    };

    const createdUser = new this.userModel(newUserData);

    const newUser = await createdUser.save();
    return newUser;
  }

  async findOneById(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({ username }).exec();
  }
}
