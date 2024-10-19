import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto'


@Injectable()
export class AppService {
  private s3: S3Client;
  constructor(private env: ConfigService) {
    this.s3 = new S3Client({
      forcePathStyle: true
    })
  }

  async upload(files: Array<Express.Multer.File>) {
    const fileCommands = files.map(file =>
      new PutObjectCommand({
        Bucket: this.env.getOrThrow('AWS_S3_BUCKET'),
        Key: crypto.randomUUID(),
        ContentType: file.mimetype,
        Body: file.buffer,
      })
    )

    const uploadFiles = await Promise.allSettled(fileCommands.map(command => this.s3.send(command)))
    const baseUrl = 'http://localhost:9000/' + this.env.getOrThrow('AWS_S3_BUCKET')
    return uploadFiles.map(({ status }, i) => status && baseUrl + '/' + fileCommands[i].input.Key)
  }
}