import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.interface';
import { NewUserInput } from './dto/new-user.input';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(data: NewUserInput): Promise<User> {
    const userExist = await this.userModel
      .count({ username: data.username })
      .exec();

    if (userExist > 0) {
      throw new Error('User already exists');
    }

    const createdUser = new this.userModel(data);

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
