import { AuthGuard } from "@nestjs/passport";
import { UserService } from '../user/user.service';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { User } from 'src/user/user.entity';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
    constructor(private userService: UserService, private reflector: Reflector) {
        super();
    }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        await super.canActivate(context);
        const roles = this.reflector.get(Roles, context.getHandler());
        console.log('JwtAdminGuard roles', roles)
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