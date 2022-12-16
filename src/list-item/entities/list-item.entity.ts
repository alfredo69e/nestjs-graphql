import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { List } from './../../lists/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './../../items/entities';

@Entity('listItems')
@ObjectType()
export class ListItem {
  
  @Field(() => ID, { name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Number, { name: 'quantity' })
  @Column({
    type: 'numeric'
  })
  quantity: number;

  @Field(() => Boolean, { name: 'complete' })
  @Column({
    type: 'boolean'
  })
  complete: boolean;


  @ManyToOne( ( ) => List, ( list ) => list.listItem, { lazy: true } )
  list: List;

  @ManyToOne( () => Item, ( item ) => item.listItem, { lazy: true } )
  @Field(() => Item )
  item: Item;

  
}
