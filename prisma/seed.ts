import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';


const demoProduct = () => ({
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price()),
    images: Array.from({ length: 4 }).map(() => faker.image.url()),

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