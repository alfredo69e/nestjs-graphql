import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  
  @Field(() => Int, { nullable: true, name: 'quantity' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;


  @Field(() => Boolean, { nullable: true, name: 'complete' })
  @IsBoolean()
  @IsOptional()
  complete: boolean = false;

  @Field(() => ID, { name: 'listId' })
  @IsUUID()
  listId: string;

  @Field(() => ID, { name: 'itemId' })
  @IsUUID()
  itemId: string;


}
