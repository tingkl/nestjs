import { UserService } from './../../user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/roles/roles.decorator';
import { User } from 'src/user/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private reflector: Reflector) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    console.log('roles', roles)
    if (!roles) {
      return true;
    }
    console.log(roles)

    const req = context.switchToHttp().getRequest()
    console.log('user', req.user)
    const user = await this.userService.find(req.user.username) as User;
    if (user.roles.filter((o) => o.id == 2).length > 0) {
      return true;
    }
    return false;
  }
}
