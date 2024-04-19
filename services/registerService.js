import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createNewUser(data) {
    try {
        // Check if email exists
        const isEmailExist = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (isEmailExist) {
            throw new Error(`This email "${data.email}" has already exist. Please choose another email`);
        } else {
            // Hash password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(data.password, salt);

            // Create a new user
            const newUser = await prisma.user.create({
                data: {
                    username: data.username,
                    hasher: bcrypt,
                    password: hashedPassword,
                    passwordSalt: hashedPassword
                },
            });

            return newUser;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function checkExistEmail(email) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        return user !== null;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default { createNewUser, checkExistEmail };
