import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2'
@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }
    async signin(username: string, password: string) {
        const user = await this.userService.find(username)
        if (!user) {
            throw new ForbiddenException('用户不存在，请注册')
        }
        console.log(user.password)
        console.log(password)
        const isPasswordValid = await argon2.verify(user.password, password)
        if (!isPasswordValid) {
            throw new ForbiddenException('用户名或密码错误')
        }
        return this.jwtService.signAsync(
            {
                username: user.username,
                sub: user.id
            },
            // 局部设置 一般用于refreshToken
            // {
            //     expiresIn: '1d'
            // }
        )
    }
    async signup(username: string, password: string) {
        const user = await this.userService.find(username);
        if (user) {
            throw new ForbiddenException('用户已存在')
        }
        return this.userService.create({ username, password });
    }
}
