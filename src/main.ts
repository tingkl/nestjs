import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  // 关闭整个nestjs的日志
  const app = await NestFactory.create(AppModule, {
    cors: true
    // 关闭所有日志
    // logger: false 
    // logger: ['error', 'warn']
  });
  app.setGlobalPrefix('api');
  const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  // app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({
    // 去除类上不存在的字段
    whitelist: true
  }));
  // app.useGlobalGuards();
  // 弊端 -> 无法使用DI -> 无法访问userService等DI上的bean
  await app.listen(3000);
}
bootstrap();
