import { ApiProperty } from "@nestjs/swagger"

export class ProductEntity {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    description: string

    @ApiProperty()
    price: number

    @ApiProperty()
    images: string[]

    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial);
    }
}

export class ProductsEntity {
    @ApiProperty()
    meta: {
        page: number,
        limit: number,
        count: number
    }


    @ApiProperty({ type: [ProductEntity] })
    data: ProductEntity[]

    constructor(partial: Partial<ProductsEntity>) {
        Object.assign(this, partial)
    }
}