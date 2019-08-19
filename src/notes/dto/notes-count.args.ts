import { IsOptional } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class NotesCountArgs {
  @Field()
  @IsOptional()
  query: string = '';
}
