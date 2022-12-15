import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ValidRoles } from '../../auth/enums/valid-roles.enum';
import { Item } from './../../items/entities';

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


  @Field(() => [ ValidRoles ], { name: 'roles' })
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: ValidRoles[];


  @Field(() => Boolean, { name: 'isActive' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // @Field(() => ID, { name: 'isActive' })
  // @Column({ type: 'boolean', default: true })
  // isLast: boolean;

  // TODO: relaciones
  @Field(() => User, { name: 'lastUpdateBy', nullable: true })
  @ManyToOne( () => User, ( user ) => user.lastUpdateBy, { nullable: true, lazy: true } )
  @JoinColumn({ name: 'lastUpdateBy' })
  lastUpdateBy?: User;

  @OneToMany( () => Item, ( item ) => item.user, { lazy: true } )
  // @Field( () => [ Item ] )
  items: Item[];
}
