import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities';
import { CreateItemInput, UpdateItemInput } from './dto';
import { JwtAuthGuard } from './../auth/guards';
import { CurrentUser } from './../auth/decorators';
import { User } from './../users/entities';

@Resolver(() => Item)
@UseGuards( JwtAuthGuard )
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
    ): Promise<Item> {
    return await this.itemsService.create( createItemInput, user );
  }

  @Query(() => [ Item ], { name: 'items' })
  async findAll(
    @CurrentUser() user: User
  ): Promise<Item[]> {
    return await this.itemsService.findAll( user );
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser() user: User
    ): Promise<Item> {
    return await this.itemsService.findOne( id, user );
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User
    ): Promise<Item> {
    return await this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item)
  async removeItem(
      @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
      @CurrentUser() user: User
    ): Promise<Item> {
    return await this.itemsService.remove( id, user );
  }
}
