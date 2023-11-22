import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }
    async signin(username: string, password: string) {
        const user = await this.userService.find(username)
        if (user && user.password === password) {
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
        throw new UnauthorizedException();
    }
    signup(username: string, password: string) {
        return this.userService.create({ username, password });
    }
}
