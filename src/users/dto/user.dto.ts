import { Field, ID, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  createdDate: Date;
}
