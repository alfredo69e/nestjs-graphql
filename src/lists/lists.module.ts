import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { List } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../auth/auth.module';

@Module({
  providers: [ ListsResolver, ListsService ],
  imports: [
    TypeOrmModule.forFeature([
      List
    ]),
  ],
  exports: [
    TypeOrmModule,
    ListsService
  ]

})
export class ListsModule {}
