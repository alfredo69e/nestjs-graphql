import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './../../users/entities';
import { JwtPayload } from './../interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        configService: ConfigService,
        private readonly authService: AuthService,
    ){

        super({
            secretOrKey: configService.get<string>('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate( payload: JwtPayload ): Promise<User> {

        const { id } = payload;
        
        return await this.authService.validateUser( id );
    }

}