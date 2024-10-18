import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    Logger,
    BadRequestException,
    HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('PrismaExceptionFilter');
    constructor(private env: ConfigService) { }

    catch(
        exception:
            | Prisma.PrismaClientKnownRequestError
            | Prisma.PrismaClientValidationError,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (this.env.get('NODE_ENV') === 'development') {
            this.logger.error(exception)
        }

        let message = [`PrismaClientValidationError`];
        let statusCode = HttpStatus.FORBIDDEN;

        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            message = [exception.code];
            switch (exception.code) {
                case 'P2002':
                    message = [`This ${exception.meta?.target} already exists`]
                    break;
                case 'P2003':
                    message =
                        [`Foreign key constraint failed on the field: ${exception.meta?.field_name}`];
                    break;
                case 'P2025':
                    statusCode = HttpStatus.NOT_FOUND;
                    message = [`Recorde with ID#${request.params?.id} is Not Found`];
                    break;
            }
        } else if (exception instanceof Prisma.PrismaClientValidationError) {
            const validations = exception.message.split('Argument');
            validations.shift();
            message = validations;
        }

        response.status(statusCode).send({
            statusCode,
            message,
            error: exception.message?.split('\n').pop() || exception.name,
        });
    }
}
