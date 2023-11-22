import { ConfigEnum } from './../enum/config.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './auth.strategy';
@Module({
  imports: [
    UserModule,
    PassportModule,
    // JwtModule.register({
    //   secret: 'bulabul'
    // })
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
      ({
        secret: configService.get<string>(ConfigEnum.SECRET),
        signOptions: {
          expiresIn: '1d'
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
