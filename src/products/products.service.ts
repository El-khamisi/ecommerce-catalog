import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ListQueryDto } from "./dtos";
import { ProductsEntity, ProductEntity } from "./entities";

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async listProducts(query: ListQueryDto) {
        const { page, limit } = query;

        const products = await this.prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
        })

        const productCounts = await this.prisma.product.count()

        return new ProductsEntity({
            meta: {
                page: page,
                count: productCounts,
                limit: limit
            },
            data: products.map(product => new ProductEntity(product))
        })
    }

    async findOne(productId: string) {
        const product = await this.prisma.product.findUniqueOrThrow({
            where: { id: productId }
        })

        return new ProductEntity(product)
    }
}
