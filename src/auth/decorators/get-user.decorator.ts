import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if( !user ) throw new InternalServerErrorException('User not found in request');
        if( !user.hasOwnProperty('id') ) throw new InternalServerErrorException('User not found in request');

        if( !data ) return user;

        return user[data];
    }

)