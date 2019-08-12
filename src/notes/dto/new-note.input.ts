import { Length, MaxLength } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class NewNoteInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field()
  @Length(10, 255)
  body: string;
}
