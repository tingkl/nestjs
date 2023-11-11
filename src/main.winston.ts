import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { createLogger } from 'winston';
import * as winston from 'winston'
import { WinstonModule, utilities } from 'nest-winston';
import DailyRotateFile = require('winston-daily-rotate-file');
async function bootstrap() {
  const instance = createLogger({
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike()
        )
      }),
      new DailyRotateFile({
        level: 'warn',
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple()
        )
      })
    ]
  })
  // 关闭整个nestjs的日志
  const app = await NestFactory.create(AppModule, {
    // 关闭所有日志
    // logger: false 
    // logger: ['error', 'warn']
    logger: WinstonModule.createLogger({
      instance
    })
  });
  app.setGlobalPrefix('api');
  const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  await app.listen(3000);
}
bootstrap();
