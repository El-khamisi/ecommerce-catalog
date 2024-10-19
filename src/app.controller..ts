import { Controller, Get, ParseArrayPipe, Post, Query, Render, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { ProductsService } from "./products/products.service";
import { ListQueryDto } from "./products/dtos";

@ApiTags()
@Controller()
export class AppController {
  constructor(private appService: AppService, private productsService: ProductsService) { }


  @Get()
  @Render('index')
  async viewListProducts(@Query() query: ListQueryDto, @Query('others', new ParseArrayPipe({ separator: ',', optional: true })) others: any) {
    const products = await this.productsService.listProducts({ ...query, others })
    return { products: products }
  }

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