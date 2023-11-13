import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import * as requestIp from 'request-ip';
import { QueryFailedError } from "typeorm";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost) {
    }
    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        let error = exception.response || 'Internal Server Error';
        if (exception instanceof QueryFailedError) {
            error = exception.message;
        }
        const responseBody = {
            headers: request.headers,
            query: request.query,
            body: request.body,
            params: request.params,
            timestamp: new Date().toISOString(),
            ip: requestIp.getClientIp(request),
            exception: exception.name,
            error
        };
        // this.logger.error('[tomic]', responseBody)
        httpAdapter.reply(response, responseBody, httpStatus)
    }
}