import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import { DisplayType } from "src/products/dtos";


const demoProduct = () => ({
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price()),
    images: Array.from({ length: 3 }).map(() => faker.image.url()),
    attributes: Array.from({ length: 2 }).map(() => {
        const display = faker.helpers.enumValue(DisplayType)
        const variants = {
            [DisplayType.Color]: { name: 'colors', values: Array.from({ length: 2 }).map(() => faker.color.rgb()) },
            [DisplayType.Radio]: { name: 'size', values: Array.from({ length: 2 }).map(() => faker.helpers.arrayElement(['S', 'M', 'L', 'XL'])) },
            [DisplayType.Dropdown]: { name: 'brand', values: Array.from({ length: 2 }).map(() => faker.helpers.arrayElement(['Dior', 'Nike', 'Rolex', 'H&M'])) },
            [DisplayType.Checkbox]: { name: 'materials', values: Array.from({ length: 2 }).map(() => faker.helpers.arrayElement(['Plastic', 'Wood', 'Glass', 'Iron'])) },
        }

        return { type: display, ...variants[display] }
    })
})


const prisma = new PrismaClient();


async function main() {



    await prisma.product.createMany({
        data: Array.from({ length: 6 }).map(() => demoProduct())
    })

}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (err) => {
        console.error(err);
        process.exit(1);
    });