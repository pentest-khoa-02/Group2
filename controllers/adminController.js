import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const adminPage = async (req, res) => {
    const jwtStatus = await prisma.vulnSetting.findUnique({
        where: {name: "JWT"}
    })
    const token = req.cookies.jwt
    let mysecretkey = process.env.JWT_SECRET
    const encodedHeader = token.split(".")[0]
    const decodedHeader = Buffer.from(encodedHeader, 'base64').toString('utf-8')
    const header = JSON.parse(decodedHeader)
    if(jwtStatus.status == "None-Alg" && header.alg == 'none') mysecretkey = null

    await jwt.verify(token, mysecretkey, (err, result) => {
        if(err) res.send(err)
        else{
            const isAdmin = result.isadmin
            if(isAdmin == true) return res.render("admin")
            else return res.send("You are not allowed!")
        }
    })
}

export default {adminPage}