import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './entities';
import { UpdateUserInput, ValidRolesArgs } from './dto';
import { JwtAuthGuard } from './../auth/guards';
import { CurrentUser } from './../auth/decorators';
import { ValidRoles } from './../auth/enums';
import { ItemsService } from './../items/items.service';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    ) {}

  
  @Query(() => [ User ], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User
  ): Promise<User[]> {
    return await this.usersService.findAll( validRoles.roles );
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User
    ): Promise<User> {
    return await this.usersService.findOneById( id );
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User
  ): Promise<User> {
    return await this.usersService.update(updateUserInput.id, updateUserInput, user );
  }

  @Mutation(() => User, { name: 'blockUser' })
  async blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ ValidRoles.admin ]) user: User
    ): Promise<User> {
    return this.usersService.blockUser( id, user );
  }

  @ResolveField( () => Int, { name: 'itemCount' } )
  async itemCount(
    @Parent() user: User,
    @CurrentUser([ ValidRoles.admin ]) adminUser: User
  ): Promise<number> {
    return this.itemsService.itemCountByUser( user );
  }
}
