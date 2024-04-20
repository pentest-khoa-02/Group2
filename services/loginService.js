import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handleLogin = async (username, password) => {
    try {
        const user = await prisma.credential.find({
            where: {
                username: username,
            },
        });
        if (!user) {
            throw new Error(`Username or Password wrong`);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error(`Username or Password wrong`);
        }
        return true;
    } catch (error) {
        throw error;
    }
};

const findUserByEmail = async (username) => {
    return await prisma.credential.find({
        where: {
            username: username,
        },
    });
};

const comparePassword = async (password, credentialObject) => {
    const isMatch = await bcrypt.compare(password, credentialObject.password);
    if (!isMatch) {
        return `Username or Password wrong`;
    }
    return true;
};

export default {
    handleLogin,
    findUserByEmail,
    comparePassword
};