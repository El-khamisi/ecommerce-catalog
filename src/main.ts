import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  // Build Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('E-commerce Catalog REST API')
    .setDescription('E-commerce Catalog REST API')
    .setVersion('1.0.0')
    .build();



  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_, methodKey: string) => methodKey,
  }), {
    customSiteTitle: 'E-commerce Catalog REST API',
  });


  const port = process.env.PORT ?? 3000
  await app.listen(port);
  logger.log('Application started and listening on port' + port)
}
bootstrap();
