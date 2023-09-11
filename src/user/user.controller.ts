import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private configService: ConfigService) { }
    @Get()
    getUsers() {
        // const db = this.configService.get('DB');
        // const host = this.configService.get('DB_HOST');
        // console.log("db", db);
        // console.log("host", host);
        // return this.userService.getUsers();
        return this.userService.findAll()
    }

    @Post()
    addUser() {
        const user = { username: 'tomic', password: '123456' } as User;
        return this.userService.create(user);
    }

}
