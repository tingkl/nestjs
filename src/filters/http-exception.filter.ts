import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    // constructor(private logger: Logger) { }
    private logger = new Logger(HttpExceptionFilter.name)

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception.getStatus();

        this.logger.error(exception.message, exception.stack);
        response.status(status).json({
            code: status,
            timestamp: new Date().toISOString(),
            patch: request.url,
            method: request.method,
            message: exception.message || HttpException.name
        })
        // throw new Error('Method not implemented.');
    }
}