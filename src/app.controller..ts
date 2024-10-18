import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags()
@Controller()
export class AppController {
  constructor(private appService: AppService) { }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    }
  })
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.appService.upload(files)
  }
}