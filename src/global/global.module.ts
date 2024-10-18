import { ClassSerializerInterceptor, Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaExceptionFilter } from './prisma-exception.filter';

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: PrismaExceptionFilter,
        }
    ],
    exports: [PrismaService]
})
export class GlobalModule { }
