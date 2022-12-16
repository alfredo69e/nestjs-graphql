import { Injectable } from '@nestjs/common';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { User } from './../users/entities';
import { ListItem } from './entities/list-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './../lists/entities';
import { PaginationArgs } from '../common/dto/args/pagination.arg';
import { SearchArgs } from '../common/dto/args/search.arg';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository( ListItem )
    private readonly listItemsRepository: Repository< ListItem >
  ) {}


  async create(createListItemInput: CreateListItemInput, user: User): Promise<ListItem> {

    const { itemId, listId, ...resto } = createListItemInput;

     const newListItems = this.listItemsRepository.create({
      ...resto,
      item: { id: itemId },
      list: { id: listId },
     });

    return await this.listItemsRepository.save( newListItems );
  }

  async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<ListItem[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository.createQueryBuilder()
            .take( limit )
            .skip( offset )
            .where(`"listId" = :listId`, { listId: list.id });

    if ( search ) {
      queryBuilder.andWhere('LOWER() like :name', { name: `%${ search.toLowerCase() }%` })
    }

    return await queryBuilder.getMany();
  
  }

  async countListItemByList( list: List ): Promise<number> {
    return await this.listItemsRepository.count({
      where: {
        list: {
          id: list.id
        }
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(id: number, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
