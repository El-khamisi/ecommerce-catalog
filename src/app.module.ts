import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GlobalModule } from './global/global.module';
import { ProductsModule } from './products/products.module';
import environment from './environment';
import { AppController } from './app.controller.';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment],
    }),
    GlobalModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
