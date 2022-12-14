import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from './../enums';
import { User } from './../../users/entities';


export const CurrentUser = createParamDecorator(
    ( roles: ValidRoles[] = [], context: ExecutionContext ) => {

        const ctx = GqlExecutionContext.create( context );

        const user = ctx.getContext().req.user as User;

        if( !user )
            throw new InternalServerErrorException(`No use inside the request - make sure that we used the AuthGuard`);


        if( roles.length == 0 ) return user;
        
        for (const role of user.roles) {
            if( roles.includes( role as ValidRoles ) ) {
                return user;
            }
        }

        throw new ForbiddenException(`User ${ user.fullName } need a valid role [ ${roles} ]`);
            
})