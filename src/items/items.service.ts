import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>
  ) {}
  
  
  async create( createItemInput: CreateItemInput ): Promise<Item> {

    const newItem = this.itemsRepository.create( createItemInput );

    const save = await this.itemsRepository.save( newItem );

    return save;
  }

  async findAll(): Promise<Item[]> {

    // TODO: filtrar

    return this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({ id });

    if ( !item )
      throw new NotFoundException(`Item with id: ${id} not found`);
    
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {

    await this.findOne( id );

    const item = await this.itemsRepository.preload( updateItemInput );

    return this.itemsRepository.save( item );
  }

  async remove(id: string): Promise<Item> {

    const item = await this.findOne( id );

    await this.itemsRepository.remove( item );

    return {...item, id};
  }
}
