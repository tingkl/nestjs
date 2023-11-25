import { AuthService } from './auth.service';
import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SigninUserDto } from './dto/signin-user.dto';
// import { SerializeInterceptor } from 'src/interceptors/serialize/serialize.interceptor';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    constructor(private authService: AuthService) { }
    @Post('/signin')
    // @UseInterceptors(SerializeInterceptor)
    async signin(@Body() dto: SigninUserDto) {
        const { username, password } = dto;
        const token = await this.authService.signin(username, password)
        return {
            access_token: token
        }
    }

    @Post('/signup')
    signup(@Body() dto: SigninUserDto) {
        const { username, password } = dto;
        return this.authService.signup(username, password)
    }
}
