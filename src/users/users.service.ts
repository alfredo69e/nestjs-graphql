import { Injectable, BadRequestException, InternalServerErrorException, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { SignUpInput } from './../auth/dto';
import { ExceptionEnum } from './../common/helpers';
import { ValidRoles } from './../auth/enums';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository( User )
    private readonly usersRepository: Repository<User>
  ) {}

  async create( signUpInput: SignUpInput ): Promise<User> {
   try {

    const newUser = this.usersRepository.create({ 
      ...signUpInput,  
      password: bcrypt.hashSync( signUpInput.password, 10 )
    });

     return await this.usersRepository.save( newUser );

   } catch ( err ) {
    this.handleDBErros( err );
   }
  }

  async findAll( roles: ValidRoles[] ): Promise<User[]> {

    if ( roles.length === 0 )  return await this.usersRepository.find();



    return await this.usersRepository.createQueryBuilder()
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameter('roles', roles)
        .getMany();
  }

  async findOne(id: string): Promise<User> {
     throw new Error(`findOne not implemented`);
    ;
  }

  async findOneEmail( email: string): Promise<User> {
     try {

      return await this.usersRepository.findOneByOrFail({ email });
     
     } catch ( err ) {
      this.handleDBErros({ code: ExceptionEnum.NotFoundException, detail: `${ email } not Found` });
     }
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  async blockUser(id: string): Promise<User> {
    throw new Error(`blockUser not implemented`);
  }

  async findOneById( id: string ): Promise<User> {

    try {

      return await this.usersRepository.findOneByOrFail({ id });
      
    } catch ( err ) {
      this.handleDBErros({ code: ExceptionEnum.NotFoundException, detail: `${ id } not Found` });
    }

  }

  private handleDBErros( err: any ): never {
   
    switch ( err.code ) {
      case '23505':
        throw new BadRequestException( err.detail.replace('Key', '') );
      
      case ExceptionEnum.NotFoundException:
        throw new NotFoundException( err.detail );
    
      default:
        this.logger.error( err );
        throw new InternalServerErrorException(`Please check server logs`);
    }

   

    
    
  }
}
