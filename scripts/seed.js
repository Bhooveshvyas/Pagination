const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
    "electronics",
    "fashion",
    "books",
    "sports",
    "home"
];

async function main() {

    const batchSize = 10000;
    const totalBatches = 20; // 20 * 10000 = 200,000 products

    for (let batch = 0; batch < totalBatches; batch++) {

        const products = [];

        for (let i = 0; i < batchSize; i++) {

            const createdAt = new Date(
                Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
            );

            products.push({
                name: `Product_${batch}_${i}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                price: Number((Math.random() * 1000).toFixed(2)),
                createdAt,
                updatedAt: createdAt
            });
        }

        await prisma.product.createMany({
            data: products
        });

        console.log(`Batch ${batch + 1}/${totalBatches} done`);
    }
}

main()
    .then(() => {
        console.log("Finished seeding 200,000 products");
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        return prisma.$disconnect();
    });