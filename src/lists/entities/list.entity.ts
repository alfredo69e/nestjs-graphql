import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, Index, OneToMany } from 'typeorm';
import { User } from './../../users/entities';
import { ListItem } from './../../list-item/entities';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  
  @Field(() => ID, { name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { name: 'name' })
  @Column({ type: 'text' })
  name: string;

  @Field(() => User, { name: 'user' })
  @ManyToOne( () => User, ( user ) => user.lists , { nullable: false, lazy: true })
  @Index('userId-list-index')
  user: User;

  @OneToMany( ( ) => ListItem, ( listItem ) => listItem.list, { lazy: true } )
  // @Field(() => [ ListItem ], { name: 'user' })
  listItem: ListItem[];

}
