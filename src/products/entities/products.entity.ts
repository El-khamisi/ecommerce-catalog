import { ApiProperty } from "@nestjs/swagger"
import { DisplayType } from "../dtos";
import { Transform, Type } from "class-transformer";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class ProductAttributesEntity {
    @ApiProperty({ enum: DisplayType })
    type: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    values: string[];

    constructor(partial: Partial<ProductAttributesEntity>) {
        Object.assign(this, partial);
    }
}


export class ProductEntity {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    description: string

    @Type(() => Number)
    @ApiProperty({ type: Number })
    price: Decimal

    @ApiProperty()
    images: string[]


    @Transform(({ value }) => {
        if (typeof value == 'string') return JSON.parse(value);
        else return value;
    })
    @ApiProperty({ type: ProductAttributesEntity })
    attributes: Prisma.JsonValue;


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