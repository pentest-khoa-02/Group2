import { PrismaClient } from "@prisma/client";
import md5 from "md5"

const prisma = new PrismaClient();

async function createNewUser(username, email, password) {
    try {
        // Check if email exists
        const isEmailExist = await prisma.credential.findFirst({
            where: {
                email: email
            },
        });

        if (isEmailExist) {
            throw new Error(`This username "${email}" has already exist. Please choose another username`);
        } else {
            const rowCount = await prisma.credential.count();
            const createUser = await prisma.user.create({
                data: {
                    id: rowCount + 1,
                    isAdmin: false
                }
            })

            console.log(createUser)

            // Create a new user
            const newUser = await prisma.credential.create({
                data: {
                    id: rowCount + 1,
                    userId: createUser.id,
                    username: username,
                    email: email,
                    password: md5(password),
                },
            })
        }
        
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function checkExistEmail(email) {
    try {
        const user = await prisma.credential.findFirst({
            where: {
                email: email,
            },
        });
        console.log(user)
        return user !== null;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default { createNewUser, checkExistEmail };
