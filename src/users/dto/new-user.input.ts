import { Length, MaxLength, MinLength } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  @MaxLength(30)
  username: string;

  @Field()
  @MinLength(8)
  password: string;
}
