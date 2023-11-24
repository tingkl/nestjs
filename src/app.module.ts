import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { LogsModule } from './logs/logs.module';

import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { User } from './user/user.entity'
import { Profile } from './user/profile.entity'
import { Roles } from './roles/roles.entity';
import { Logs } from './logs/logs.entity';
// import { LoggerModule } from 'nestjs-pino'
// import { join } from 'path'
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAdminGuard } from './guards/jwt.admin.guard';
console.log(process.env.NODE_ENV)
enum ConfigEnum {
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD'
}
@Global()
@Module({
  imports: [
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport: {
    //       targets: [
    //         {
    //           level: 'info',
    //           target: 'pino-pretty',
    //           options: {
    //             colorize: true
    //           }
    //         },
    //         {
    //           level: 'info',
    //           target: 'pino-roll',
    //           options: {
    //             file: join('logs', 'log.txt'),
    //             frequency: 'daily',
    //             mkdir: true
    //           }
    //         }
    //       ]
    //     }
    //   }
    //   // pinoHttp: {
    //   //   transport: process.env.NODE_ENV == 'development' ? {
    //   //     target: 'pino-pretty',
    //   //     options: {
    //   //       colorize: true
    //   //     }
    //   //   } : {
    //   //     target: 'pino-roll',
    //   //     options: {
    //   //       file: 'log.txt',
    //   //       frequency: 'daily',
    //   //       mkdir: true
    //   //     }
    //   //   }
    //   // }
    // }),
    ConfigModule.forRoot({
      isGlobal: true, // UserModule就不需要重新导入ConfigModule
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema: Joi.object({
        DB_PORT: Joi.number().required()
      })
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(ConfigEnum.DB_HOST),
        port: configService.get(ConfigEnum.DB_PORT),
        password: 'example',
        username: 'root',
        database: 'testdb',
        entities: [User, Profile, Logs, Roles],
        // 同步本地的schema与数据库 -> 初始化的时候去使用
        synchronize: true,
        // logging: [
        //   'error', 'log'
        // ]
        logging: true
      } as TypeOrmModuleOptions),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: 'mongodb://root:example@localhost:27017/admin',
        retryAttempts: 10,
        retryDelay: 5000
      } as MongooseModuleOptions),
    }),
    LogsModule,
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    Logger,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAdminGuard
    // }
  ],
  exports: [Logger]
})
export class AppModule { }
// import * as config from 'config'
// console.log(config.get('database'))
// @Module({
//   // imports: [UserModule],
//   controllers: [],
//   providers: [],
// })

// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   password: 'example',
//   username: 'root',
//   database: 'testdb',
//   entities: [],
//   // 同步本地的schema与数据库 -> 初始化的时候去使用
//   synchronize: true,
//   logging: [
//     'error'
//   ]
// }),