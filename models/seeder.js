const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Use faker.js to generate 50 products with id, title, picture, summary, description, price, discountType, discountValue
const { faker } = require("@faker-js/faker");

async function main() {
  for (let i = 0; i < 50; i++) {
    await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        picture: faker.image.url(),
        summary: faker.commerce.productDescription(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });