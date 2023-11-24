import { Body, Controller, Get, Inject, Logger, LoggerService, Post, Param, Query, Head, Headers, UseFilters, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FindAll } from './user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user/create-user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { Roles } from 'src/roles/roles.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { JwtAdminGuard } from 'src/guards/jwt.admin.guard';

@Controller('user')
// @UseFilters(TypeormFilter)
@UseGuards(JwtAdminGuard)
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
    @Roles(["vip"])
    // @UseGuards(AuthGuard('jwt'), AdminGuard)
    // @UseGuards(AdminGuard)
    getUsers(@Query() query: FindAll) {
        this.logger.log('请求getUsers成功')
        this.logger.warn('请求getUsers成功')
        this.logger.error('请求getUsers成功')
        this.logger.debug('请求getUsers成功')
        this.logger.verbose('请求getUsers成功')
        return this.userService.findAll(query)
        // const db = this.configService.get('DB');
        // const host = this.configService.get('DB_HOST');
        // console.log("db", db);
        // console.log("host", host);
        // return this.userService.getUsers();
    }
    @Get('/profile')
    // @UseGuards(AuthGuard('jwt'))
    getuserProfile(@Query('id', ParseIntPipe) id: any, @Req() req) {
        console.log("🚀 ~ file: user.controller.ts:28 ~ UserController ~ getuserProfile ~ req:", req.user)
        console.log("🚀 ~ file: user.controller.ts:44 ~ UserController ~ getuserProfile ~ id:", id, typeof id)
        return 'ok'
    }

    @Post()
    addUser(@Body(CreateUserPipe) dto: CreateUserDto) {
        const user = { username: 'tomic', password: '123456' } as User;
        return this.userService.create(user);
    }

    @Post("/test/:id/:name")
    @UseGuards(AdminGuard)
    test(
        @Body() dto: any,
        @Headers("Content-Type") contentType: string,
        @Param("id") id: number,
        @Param("name") name: String, @Query() query: any) {
        console.log("🚀 ~ file: user.controller.ts:45 ~ UserController ~ contentType:", contentType)
        console.log("🚀 ~ file: user.controller.ts:41 ~ UserController ~ test ~ query:", query)
        console.log("🚀 ~ file: user.controller.ts:41 ~ UserController ~ test ~ name:", name)
        console.log("🚀 ~ file: user.controller.ts:41 ~ UserController ~ test ~ id:", id)
        console.log("🚀 ~ file: user.controller.ts:41 ~ UserController ~ test ~  dto:", dto)
        return dto;
    }
}
