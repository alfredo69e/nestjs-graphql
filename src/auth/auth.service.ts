import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { LoginInput, SignUpInput } from './dto';
import { AuthResponse } from './types';
import { UsersService } from './../users/users.service';
import { User } from '../users/entities';

@Injectable()
export class AuthService {

    constructor(
       private readonly usersService: UsersService,
       private readonly jwtService: JwtService,
    ) {}



    async signUp( data: SignUpInput ): Promise<AuthResponse> {

        const user = await this.usersService.create( data ); 

        const token = await this.getJwtToken( user.id );

        return { token, user };
    }

    async login( data: LoginInput ): Promise<AuthResponse> {

        try {

            const { email, password } = data;

            const user = await this.usersService.findOneEmail( email );

            if ( !bcrypt.compareSync( password, user.password ) ) 
                throw new BadRequestException(`User or Password Incorrect`);
            
            const token = await this.getJwtToken( user.id );

            return {
                token,
                user
            }
            
        } catch ( err ) {
            
        }

    }

    private async getJwtToken( userId: string ): Promise<string> {
        return await this.jwtService.signAsync({ id: userId })
    }

    async validateUser( id: string ): Promise<User> {

        const user = await this.usersService.findOneById( id );

        if( !user.isActive )
            throw new UnauthorizedException(`User is inactive, talk with admin `);

        delete user.password;
            
        return user;

    }

    async refreshToken( user: User ): Promise<AuthResponse> {
        const token = await this.getJwtToken( user.id );

        return { token, user };
    }
}
