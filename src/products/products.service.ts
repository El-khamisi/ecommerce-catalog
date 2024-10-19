import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOneBodyDto, ListQueryDto, UpdateOneBodyDto } from "./dtos";
import { ProductsEntity, ProductEntity } from "./entities";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async createOne(body: CreateOneBodyDto) {
        const { attributes, ...rest } = body
        const product = await this.prisma.product.create({
            data: { ...rest, attributes: JSON.stringify(attributes) }
        })
        return new ProductEntity(product)

    }

    async updateOne(id: string, body: UpdateOneBodyDto) {
        const { attributes, ...rest } = body

        const product = await this.prisma.product.update({
            where: { id },
            data: { ...rest, attributes: JSON.stringify(attributes) }
        })
        return new ProductEntity(product)

    }

    async listProducts(query: ListQueryDto) {
        const { q, page, limit, others } = query;

        const attributes = (others || []).map(attr => {
            const [name, value] = attr.split('=')
            return { name, value: [value] }
        })
        const whereCond: Prisma.ProductWhereInput = {
            name: {
                contains: q,
                mode: 'insensitive'
            },
            AND: attributes.map(attr => ({
                attributes: {
                    array_contains: [{
                        'name': attr.name,
                        'values': attr.value
                    }]
                }
            }))
        }
        const products = await this.prisma.product.findMany({
            where: whereCond,
            skip: (page - 1) * limit,
            take: limit,
        })

        const productCounts = await this.prisma.product.count({ where: whereCond })

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
