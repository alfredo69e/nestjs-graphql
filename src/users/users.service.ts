import { Injectable, BadRequestException, InternalServerErrorException, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { SignUpInput } from './../auth/dto';
import { ExceptionEnum } from './../common/helpers';
import { ValidRoles } from './../auth/enums';
import { UpdateUserInput } from './dto';
import { PaginationArgs, SearchArgs } from '../common/dto';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository( User )
    private readonly usersRepository: Repository<User>,

    
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

  async findAll( roles: ValidRoles[], paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<User[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.usersRepository.createQueryBuilder()
        .take( limit )
        .skip( offset )

    if ( roles.length > 0 )  {
      queryBuilder.andWhere('ARRAY[roles] && ARRAY[:...roles]').setParameter('roles', roles);
    }

    if( search ) {
      queryBuilder.andWhere('LOWER(fullname) like :name', { name: `%${ search.toLowerCase() }%` });
    }


    return await queryBuilder.getMany();

  }

  async findOne( id: string): Promise<User> {
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

  async update(id: string, updateUserInput: UpdateUserInput, user: User ): Promise<User> {
    try {

      const userToUpdate = await this.usersRepository.preload({ ...updateUserInput, id });

      userToUpdate.lastUpdateBy = user;

      
      return await this.usersRepository.save( userToUpdate );
     
     } catch ( err ) {
      this.handleDBErros({ code: ExceptionEnum.NotFoundException, detail: `${ id } not Found` });
     }
  }

  async blockUser(id: string, user: User ): Promise<User> {
    try {

      const userToBlock = await this.findOneById( id );

      userToBlock.isActive = false;
      userToBlock.lastUpdateBy = user;
      
      return await this.usersRepository.save( userToBlock );
     
     } catch ( err ) {
      this.handleDBErros({ code: ExceptionEnum.NotFoundException, detail: `${ id } not Found` });
     }
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
