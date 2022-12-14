import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators';
import { LoginInput, SignUpInput } from './dto';
import { JwtAuthGuard } from './guards';
import { AuthResponse } from './types';
import { User } from './../users/entities';
import { ValidRoles } from './enums';

@Resolver( () => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}


  @Mutation( () => AuthResponse, { name: 'signUp' })
  async signUp(
    @Args('signUpInput') data: SignUpInput
  ): Promise<AuthResponse>{
    return await this.authService.signUp( data );
  }

  @Mutation( () => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse> {
    return await this.authService.login( loginInput );
  }

  @Query( () => AuthResponse , { name: 'refreshToken'  })
  @UseGuards( JwtAuthGuard )
  async refreshToken(
    @CurrentUser(/*[ ValidRoles.admin ]*/) user: User 
  ): Promise<AuthResponse> {
    return await this.authService.refreshToken( user );
    
  }



}
