import { Body, Controller, Get, Param, ParseArrayPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductEntity, ProductsEntity } from './entities';
import { CreateOneBodyDto, FindOneParamDto, ListQueryDto, UpdateOneBodyDto } from './dtos';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Post()
    @ApiOkResponse({ type: ProductEntity })
    createOne(@Body() body: CreateOneBodyDto) {
        return this.productsService.createOne(body)
    }

    @Patch(':id')
    @ApiOkResponse({ type: ProductEntity })
    updateOne(@Param() params: FindOneParamDto, @Body() body: UpdateOneBodyDto) {
        return this.productsService.updateOne(params.id, body);
    }

    @Get()
    @ApiOkResponse({ type: ProductsEntity })
    listProducts(@Query() query: ListQueryDto, @Query('others', new ParseArrayPipe({ separator: ',', optional: true, skipMissingProperties: true })) others: any) {
        return this.productsService.listProducts({ ...query, others });
    }

    @Get(':id')
    @ApiOkResponse({ type: ProductEntity })
    findOne(@Param() params: FindOneParamDto) {
        return this.productsService.findOne(params.id);

    }

}
