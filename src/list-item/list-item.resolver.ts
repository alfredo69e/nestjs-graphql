import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from './../auth/guards';
import { CurrentUser } from './../auth/decorators';
import { User } from './../users/entities';

@Resolver(() => ListItem)
@UseGuards( JwtAuthGuard )
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  async createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    @CurrentUser() user: User
  ): Promise<ListItem> {
    return this.listItemService.create( createListItemInput, user );
  }

  // @Query(() => [ ListItem ], { name: 'listItem' })
  // findAll(
    
  // ) {
  //   return this.listItemService.findAll();
  // }

  @Query(() => ListItem, { name: 'listItem' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string
  ): Promise<ListItem> {
    return await this.listItemService.findOne( id );
  }

  @Mutation(() => ListItem)
  async updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput
    ): Promise<ListItem> {
    return await  this.listItemService.update( updateListItemInput.id, updateListItemInput );
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
