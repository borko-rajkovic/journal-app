import { IsOptional, Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class EditNoteInput {
  @Field()
  id: string;

  @IsOptional()
  @Field({ nullable: true })
  @MaxLength(30)
  title: string;

  @IsOptional()
  @Field({ nullable: true })
  @Length(10, 255)
  body: string;
}
