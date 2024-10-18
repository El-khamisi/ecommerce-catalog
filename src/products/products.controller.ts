import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductEntity, ProductsEntity } from './entities';
import { FindOneParamDto, ListQueryDto } from './dtos';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Get()
    @ApiOkResponse({ type: ProductsEntity })
    listProducts(@Query() query: ListQueryDto) {
        return this.productsService.listProducts(query);
    }

    @Get(':id')
    @ApiOkResponse({ type: ProductEntity })
    findOne(@Param() params: FindOneParamDto) {
        return this.productsService.findOne(params.id);

    }
}
