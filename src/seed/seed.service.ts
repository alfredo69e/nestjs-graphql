import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../users/entities';
import { Item } from './../items/entities';
import { UsersService } from './../users/users.service';
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed_data';
import { ItemsService } from './../items/items.service';
import { List } from './../lists/entities/list.entity';
import { ListItem } from './../list-item/entities/list-item.entity';
import { ListItemService } from './../list-item/list-item.service';
import { ListsService } from './../lists/lists.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listItemService: ListItemService,
        private readonly listsService: ListsService,

        @InjectRepository( User )
        private readonly usersRepository: Repository<User>,

        @InjectRepository( Item )
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository( List )
        private readonly listRepository: Repository<List>,

        @InjectRepository( ListItem )
        private readonly listItemRepository: Repository<ListItem>
        
    ){
        this.isProd = this.configService.get<string>('NODE_ENV') !== 'dev';
    }

    async executeSeed(): Promise<boolean> {

        if ( this.isProd )
            throw new UnauthorizedException(`We cannot run SEED on Prod`);

        await this.deleteDataBase();

        const user = await this.loadUsers();

        await this.loadItems( user );

        const list = await this.LoadLists( user );

        const items = await this.itemsService.findAll( user, { limit: 15, offset: 0 }, {} );

        await this.loadListItems( list, items, user );

        return true;
    }

    async deleteDataBase() {

        await this.listItemRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();

        await this.listRepository.createQueryBuilder()
                .delete()
                .where({})
                .execute();

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

    async LoadLists( user: User ): Promise<List> {
        const lists = [];

        for await (const list of SEED_LISTS ) {
            lists.push( await this.listsService.create( list, user ) );
        }

        await Promise.all( lists );

        return lists[ 0 ];
    }

    async loadListItems( list: List, items: Item[], user: User ): Promise<void> {
        const listItems = [];

        for await (const item of items ) {
            listItems.push( await this.listItemService.create({
                quantity: Math.round( Math.random() * 10 ),
                complete: ( Math.round( Math.random() * 1 ) === 0 ) ? false : true,
                listId: list.id,
                itemId: item.id
            }, user ) );
        }

        await Promise.all( listItems );
    }

}
