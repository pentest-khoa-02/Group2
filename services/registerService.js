import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createNewUser(username, email, password) {
    try {
        // Check if email exists
        const isEmailExist = await prisma.credential.findUnique({
            where: {
                email: email,
            },
        });

        if (isEmailExist) {
            throw new Error(`This username "${email}" has already exist. Please choose another username`);
        } else {
            // Hash password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Create a new user
            const newUser = await prisma.credential.create({
                data: {
                    username: username,
                    email: email,
                    password: hashedPassword
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
        const user = await prisma.credential.findUnique({
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
