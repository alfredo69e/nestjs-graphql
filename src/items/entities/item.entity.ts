import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './../../users/entities';
import { ListItem } from './../../list-item/entities';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  
  @Field( () => ID )
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field( () => String )
  @Column()
  name: string;

  // @Field( () => Float )
  // @Column()
  // quantity: number;

  @Field( () => String, { nullable: true } )
  @Column({ nullable: true })
  quantityUnits?: string;

  // stores users

  @Field(() => User )
  @ManyToOne( () => User, ( user ) => user.items, { lazy: true } )
  @Index('userId-index')
  user: User;


  @Field(() => [ ListItem ] )
  @OneToMany( () => ListItem, ( listItem ) => listItem.item, { lazy: true } )
  listItem: ListItem[]
}
