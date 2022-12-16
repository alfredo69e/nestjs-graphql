import { Injectable } from '@nestjs/common';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { User } from './../users/entities';
import { ListItem } from './entities/list-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  findAll() {
    return `This action returns all listItem`;
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
