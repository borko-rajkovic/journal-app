import { Length, MaxLength, IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';

@InputType()
export class NewNoteInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field()
  @Length(10, 255)
  body: string;

  @IsOptional()
  @Field(type => GraphQLUpload, { nullable: true })
  file: any;
}
