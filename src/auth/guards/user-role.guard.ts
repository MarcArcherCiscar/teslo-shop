import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(

    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get('roles', context.getHandler()) || [];
    if ( !validRoles.length ) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if ( !user ) throw new BadRequestException('User not found in request');
    if ( !user.hasOwnProperty('id') ) throw new BadRequestException('User not found in request');
    if ( !user.hasOwnProperty('roles') ) throw new BadRequestException('User has no roles');

    for (const role of user.roles) {
      if( validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(`User ${ user.email } need a valid role: [${ validRoles }]`);
  }
}
