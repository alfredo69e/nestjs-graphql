import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { name: 'id' })
  id: string;

  @Field(() => String, { name: 'fullName' })
  @Column({ type: 'text' })
  fullName: string;

  @Field(() => String, { name: 'email' })
  @Column({ type: 'text', unique: true } )
  email: string;


  // @Field(() => String, { name: 'password' })
  @Column({ type: 'text' })
  password: string;


  @Field(() => [String], { name: 'roles' })
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];


  @Field(() => Boolean, { name: 'isActive' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

}
