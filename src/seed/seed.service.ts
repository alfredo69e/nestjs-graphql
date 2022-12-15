import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../users/entities';
import { Item } from './../items/entities';
import { UsersService } from './../users/users.service';
import { SEED_USERS, SEED_ITEMS } from './data/seed_data';
import { ItemsService } from './../items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,

        @InjectRepository( User )
        private readonly usersRepository: Repository<User>,

        @InjectRepository( Item )
        private readonly itemsRepository: Repository<Item>
        
    ){
        this.isProd = this.configService.get<string>('NODE_ENV') !== 'dev';
    }

    async executeSeed(): Promise<boolean> {

        if ( this.isProd )
            throw new UnauthorizedException(`We cannot run SEED on Prod`);

        await this.deleteDataBase();

        const user = await this.loadUsers();

        await this.loadItems( user );

        return true;
    }

    async deleteDataBase() {

        await this.itemsRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();

        
        await this.usersRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();
    }

    async loadUsers(): Promise<User> {
        const users = [];

        for await (const user of SEED_USERS ) {
            users.push( await this.usersService.create( user ) );
        }

        return users[0];
    }

    async loadItems( user: User ): Promise<void> {
        const items = [];

        for await (const item of SEED_ITEMS ) {
            items.push( await this.itemsService.create( item, user ) );
        }

        await Promise.all( items );
    }

}
