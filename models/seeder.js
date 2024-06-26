const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const fs = require("fs");

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [];
  const numUsers = 50;

  for (let i = 0; i < numUsers; i++) {
    const data = {
      isAdmin: false,
      credentials: {
        create: {
          id: i + 1,
          userId: i + 1,
          username: faker.internet.userName(),
          password: "21232f297a57a5a743894a0e4a801fc3",
          email: faker.internet.email(),
        },
      },
      userInfo: {
        create: {
          id: i + 1,
          userId: i + 1,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          avatarLink: faker.image.avatar(),
          emailValidated: faker.datatype.boolean(
            faker.number.int({ min: 0, max: 1 })
          ),
          phoneValidated: faker.datatype.boolean(
            faker.number.int({ min: 0, max: 1 })
          ),
          bio: faker.lorem.paragraph(),
        },
      },
      socialProfiles: {
        create: {
          platform: faker.helpers.arrayElement([
            "facebook",
            "twitter",
            "instagram",
          ]),
          platformUrl: faker.internet.url(),
        },
      },
      vendors: {
        create: {
          slug: faker.helpers.slugify(faker.company.name()),
          name: faker.company.name(),
          vendorBio: faker.lorem.paragraph(),
          avatarUrl: faker.image.avatar(),
        },
      },
    };
    const user = await prisma.user.create({
      data,
    });
    users.push(user);
  }

  console.log(`Seeded ${users.length} users`);
  return users;
}

async function seedSocialProfiles()
{
  const socialProfiles = []
  const numSocial = 50
  for(let i = 0; i < numSocial; i++){
    const data = {
      platform: faker.helpers.arrayElement([
        "facebook",
        "twitter",
        "instagram",
      ]),
      platformUrl: faker.internet.url(),
    }
    const socialprofile = await prisma.socialProfile.create({
      data
    })
    socialProfiles.push(data)
  }
}

async function seedCredentials()
{
  const credentials = []
  const numCre = 50;
  for (let i = 0; i < numCre; i++){
    const data = {
      id: i + 1,
      userId: i + 1,
      username: faker.internet.userName(),
      password: "21232f297a57a5a743894a0e4a801fc3",
      email: faker.internet.email(),
    }
    const credential = await prisma.credential.create({
      data
    })
    credentials.push(data)
  }
  return credentials
}

async function seedUserInfos()
{
  const userInfos = []
  const numUsers = 50;
  for (let i = 0; i < numUsers; i++){
    const data = {
      id: i + 1,
      userId: i + 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      avatarLink: faker.image.avatar(),
      emailValidated: faker.datatype.boolean(
        faker.number.int({ min: 0, max: 1 })
      ),
      phoneValidated: faker.datatype.boolean(
        faker.number.int({ min: 0, max: 1 })
      ),
      bio: faker.lorem.paragraph(),
    }
    const userinfo = await prisma.userInfo.create({
      data,
    })
    userInfos.push(data)
    console.log(`Seeded ${userInfos.length} userinfos`) 
  }
  return userInfos
}

async function seedCategories() {
  const categories = [];
  const numCategories = 10;

  for (let i = 0; i < numCategories; i++) {
    const name = faker.commerce.productAdjective();
    const data = {
      slug: faker.helpers.slugify(name + "-" + faker.string.uuid()),
      name,
      description: faker.commerce.productMaterial(),
    };
    const category = await prisma.category.create({
      data,
    });
    categories.push(data);
  }
  console.log(`Seeded ${categories.length} categories`);
  return categories;
}

async function seedProducts() {
  const products = [];
  const numProducts = 100;
  const categories = await prisma.category.findMany();
  const vendors = await prisma.vendor.findMany();
  const vouchers = await prisma.voucher.findMany();

  for (let i = 0; i < numProducts; i++) {
    const price = parseFloat(faker.commerce.price());
    const title = faker.commerce.productName();
    const data = {
      categoryId: faker.helpers.arrayElement(categories).id,
      vendorId: faker.helpers.arrayElement(vendors).id,
      title,
      picture: faker.image.url(),
      summary: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      slug: faker.helpers.slugify(title + "-" + faker.string.uuid()),
      price,
      discountType: faker.helpers.arrayElement(["percentage", "fixed"]),
      discountValue: faker.number.int({ min: 10, max: 50 }),
      productVouchers: {
        create: {
          voucherId: faker.helpers.arrayElement(vouchers).id,
        },
      },
    };
    const product = await prisma.product.create({
      data,
    });
    products.push(data);
  }
  console.log(`Seeded ${products.length} products`);
  return products;
}

// seed vouchers
async function seedVouchers() {
  const vouchers = [];
  const numVouchers = 10;

  for (let i = 0; i < numVouchers; i++) {
    const data = {
      code: faker.finance.iban(),
      voucherDescription: faker.lorem.sentence(),
      discountValue: faker.number.int({ min: 10, max: 50 }),
      discountType: faker.helpers.arrayElement(["percentage", "fixed"]),
      maxUsage: faker.number.int({ min: 1, max: 10 }),
      voucherStartDate: faker.date.past(),
      voucherEndDate: faker.date.future(),
    };
    const voucher = await prisma.voucher.create({
      data,
    });
    vouchers.push(data);
  }
  console.log(`Seeded ${vouchers.length} vouchers`);
  return vouchers;
}

// seed order
async function seedOrder() {
  const orders = [];
  const numOrders = 100;
  const products = await prisma.product.findMany();
  const users = await prisma.user.findMany();
  const voucher = await prisma.voucher.findMany();
  for (let i = 0; i < numOrders; i++) {
    const quantity = faker.number.int({ min: 1, max: 5 });
    const data = {
      userId: faker.helpers.arrayElement(users).id,
      voucherId: faker.helpers.arrayElement(voucher).id,
      orderStatus: faker.helpers.arrayElement([
        "pending",
        "completed",
        "cancelled",
      ]),
      orderApprovedAt: faker.date.past(),
      orderDeliveredCarrierDate: faker.date.past(),
      orderDeliveredCustomerDate: faker.date.future(),
      orderDetails: {
        createMany: {
          data: [
            {
              productId: faker.helpers.arrayElement(products).id,
              price: parseFloat(faker.commerce.price()),
              quantity,
            },
          ],
        },
      },
    };
    const order = await prisma.order.create({
      data,
    });
    orders.push(data);
  }
  console.log(`Seeded ${orders.length} orders`);

  return orders;
}

async function seedVulnSettings() {
  const data = [
    {
      id: 1,
      name: "XSS",
      status: "No"
    },
    {
      id: 2,
      name: "CSRF",
      status: "No"
    },
    {
      id: 3,
      name: "SSRF",
      status: "No"
    },
    {
      id: 4,
      name: "SQLI",
      status: "No"
    },
    {
      id: 5,
      name: "SSTI",
      status: "No"
    },
    {
      id: 6,
      name: "XXE",
      status: "No"
    },
    {
      id: 7,
      name: "Broken Authentication",
      status: "No"
    },
    {
      id: 8,
      name: "Path Traversal",
      status: "No"
    },
    {
      id: 9,
      name: "JWT",
      status: "No"
    },
    {
      id: 10,
      name: "File upload",
      status: "No"
    },
    {
      id: 11,
      name: "OS Command Injection",
      status: "No"
    },
    {
      id: 12,
      name: "HTTP Smuggling",
      status: "No"
    },
    {
      id: 13,
      name: "Deserialization",
      status: "No"
    },
    {
      id: 14,
      name: "IDOR",
      status: "No"
    },
  ];
  try{
    const vulnSettings = await prisma.vulnSetting.createMany({
      data,
      skipDuplicates: true,
    });
    console.log(`Seeded ${data.length} vuln settings`);
  }
  catch(err){
    console.log(err)
  }
}

async function seed() {
  // clear all tables
  await prisma.$executeRaw`TRUNCATE TABLE public."User", public."UserInfo",  public."Credential", public."Category", public."Product", public."SocialProfile", public."Cart", public."Review", public."Vendor", public."AdminRole", public."Voucher" RESTART IDENTITY CASCADE`;
  
  // if seed.json exists, load data from it otherwise seed the database
  if (fs.existsSync("./models/seed.json")) {
    const data = JSON.parse(fs.readFileSync("./models/seed.json"));
    await prisma.user.createMany({ data: data.users });
    await prisma.userInfo.createMany({ data: data.userinfos});
    await prisma.credential.createMany({ data: data.credentials});
    await prisma.category.createMany({ data: data.categories });
    await prisma.vendor.createMany({ data: data.vendors });
    await prisma.product.createMany({ data: data.products });
    await prisma.voucher.createMany({ data: data.vouchers });
    await prisma.order.createMany({ data: data.orders });
    await seedVulnSettings();
    // await prisma.vulnSetting.createMany({ data: data.vulnSettings})
    return;
  }

  // seed data
  await seedUsers();
  await seedCredentials();
  await seedUserInfos();
  await seedCategories();
  await seedProducts();
  await seedVulnSettings();
  await seedVouchers();
  await seedOrder();

  const users = await prisma.user.findMany();
  const userinfos = await prisma.userInfo.findMany();
  const credentials = await prisma.credential.findMany();
  const categories = await prisma.category.findMany();
  const vouchers = await prisma.voucher.findMany();
  const vendors = await prisma.vendor.findMany();
  const products = await prisma.product.findMany();
  const orders = await prisma.order.findMany();


  // save to one json file
  const data2 = {
    users,
    userinfos,
    credentials,
    categories,
    products,
    vendors,
    vouchers,
    orders,
  };
  console.log(data2)

  fs.writeFileSync("./models/seed.json", JSON.stringify(data2));
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
