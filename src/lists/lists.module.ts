import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { List } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../auth/auth.module';
import { ListItemModule } from '../list-item/list-item.module';

@Module({
  providers: [ ListsResolver, ListsService ],
  imports: [
    TypeOrmModule.forFeature([
      List
    ]),
    
    ListItemModule
  ],
  exports: [
    TypeOrmModule,
    ListsService
  ]

})
export class ListsModule {}
