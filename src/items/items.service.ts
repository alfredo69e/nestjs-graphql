import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities';
import { User } from './../users/entities';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>
  ) {}
  
  
  async create( createItemInput: CreateItemInput, user: User ): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user });
    return await this.itemsRepository.save( newItem );

  }

  async findAll( user: User ): Promise<Item[]> {

    return this.itemsRepository.find({ 
      where: {
        user: {
          id: user.id
        }
      }
     });
  }

  async findOne(id: string, user: User): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({ id, user: { id: user.id } });

    if ( !item )
      throw new NotFoundException(`Item with id: ${id} not found`);
    
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {

    await this.findOne( id, user );

    const item = await this.itemsRepository.preload( updateItemInput );

    return this.itemsRepository.save( item );
  }

  async remove(id: string, user: User): Promise<Item> {

    const item = await this.findOne( id, user );

    await this.itemsRepository.remove( item );

    return {...item, id};
  }
}
