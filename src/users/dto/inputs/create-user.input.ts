import { InputType, Int, Field } from '@nestjs/graphql';
import { SignUpInput } from './../../../auth/dto';


@InputType()
export class CreateUserInput extends SignUpInput  {
  

}