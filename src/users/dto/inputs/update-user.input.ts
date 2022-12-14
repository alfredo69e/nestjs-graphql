import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ValidRoles } from '../../../auth/enums';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ ValidRoles ], { name: 'roles', nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];


  @Field(() => Boolean, { name: 'isActive', nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
