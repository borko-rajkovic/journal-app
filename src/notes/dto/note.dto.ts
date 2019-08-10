import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class NoteType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  createdDate: Date;
}
