import { IsOptional, Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class NotesArgs {
  @Field(type => Int)
  @Min(0)
  skip: number = 0;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(50)
  take: number;

  @Field()
  @IsOptional()
  asc: boolean = false;

  @Field()
  @IsOptional()
  query: string = '';
}
