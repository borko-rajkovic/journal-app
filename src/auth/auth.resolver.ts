import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserType } from '../users/dto/user.dto';
import { GqlAuthGuard } from '../users/gql.auth.guard';
import { CurrentUser } from '../users/user.decorator';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UserInput } from '../users/dto/new-user.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Query(returns => UserType)
  @UseGuards(GqlAuthGuard)
  async whoAmI(@CurrentUser() user: any) {
    return user;
  }

  @Mutation(returns => String)
  async login(@Args('userData') userData: UserInput) {
    return await this.authService.login(userData);
  }

  @Mutation(returns => UserType)
  async register(@Args('userData') userData: UserInput) {
    return await this.usersService.create(userData);
  }
}
