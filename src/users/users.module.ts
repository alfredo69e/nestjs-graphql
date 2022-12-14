import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';

@Module({
  providers: [ UsersResolver, UsersService ],
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),
  ],

  exports: [
    // TypeOrmModule,
    UsersService
  ]

})
export class UsersModule {}
