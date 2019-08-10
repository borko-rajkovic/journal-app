import { Field, ID, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class NoteType {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  authorId: number;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  createdDate: Date;
}
