import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllSetting() {
  try {
    const result = await prisma.vulnSetting.findMany();
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function updateSetting(id, status) {
  try {
    const active = parseInt(status)
    const result = await prisma.vulnSetting.update({
      where: { 
        id: parseInt(id)
      },
      data: {
        status: (active == 1) ? true : false
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

export default { getAllSetting, updateSetting };
