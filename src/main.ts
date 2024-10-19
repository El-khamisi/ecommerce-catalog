import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BucketAlreadyExists, BucketAlreadyOwnedByYou, CreateBucketCommand, PutBucketPolicyCommand, S3Client } from '@aws-sdk/client-s3';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const s3 = new S3Client({ forcePathStyle: true, });
  try {
    await s3.send(new CreateBucketCommand({ ACL: 'public-read', Bucket: process.env.AWS_S3_BUCKET, }))
    const today = new Date()
    s3.send(new PutBucketPolicyCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetBucketLocation", "s3:GetObject"],
          Resource: ["arn:aws:s3:::*"]
        }]
      })
    }))
  } catch (err) {
    if (!(err instanceof BucketAlreadyExists || err instanceof BucketAlreadyOwnedByYou)) {
      throw err
    }
  }

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


  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'public/views'));
  app.setViewEngine('hbs');

  const port = process.env.PORT ?? 3000
  await app.listen(port);
  logger.log('Application started and listening on port' + port)
}
bootstrap();
