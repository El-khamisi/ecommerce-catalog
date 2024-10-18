import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import environment from './environment';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment],
    }),
    GlobalModule,
  ],
})
export class AppModule { }
