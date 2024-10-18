import { ClassSerializerInterceptor, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Global()
@Module({
    providers: [PrismaService, {
        provide: APP_INTERCEPTOR,
        useClass: ClassSerializerInterceptor,
    },],
    exports: [PrismaService]
})
export class GlobalModule { }
