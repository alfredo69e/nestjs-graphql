import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, Index } from 'typeorm';
import { User } from './../../users/entities';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  
  @Field(() => ID, { name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { name: 'name' })
  @Column({ type: 'text' })
  name: string;

  @ManyToOne( () => User, ( user ) => user.lists , { lazy: true })
  @Index('userId-list-index')
  user: User;

}
