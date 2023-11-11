import { Controller, Get, Inject, Logger, LoggerService, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('user')
export class UserController {
    // private logger = new Logger(UserController.name)
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService
    ) {
        this.logger.warn('UserController init')
    }
    @Get()
    getUsers() {
        this.logger.log('请求getUsers成功')
        this.logger.warn('请求getUsers成功')
        this.logger.error('请求getUsers成功')
        this.logger.debug('请求getUsers成功')
        this.logger.verbose('请求getUsers成功')
        return this.userService.findAll()
        // const db = this.configService.get('DB');
        // const host = this.configService.get('DB_HOST');
        // console.log("db", db);
        // console.log("host", host);
        // return this.userService.getUsers();
    }

    @Post()
    addUser() {
        const user = { username: 'tomic', password: '123456' } as User;
        return this.userService.create(user);
    }

}
