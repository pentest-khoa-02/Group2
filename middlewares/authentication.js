import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const Authentication = async (req, res, next) => {
    let mysecretkey = process.env.JWT_SECRET
    const prisma = new PrismaClient()
    try{
        if(req.path == '/page-login' || req.path == '/page-register' || req.path == '/settings' || req.path == '/page-register/createUser'){
            next()
        }
        else{
            const ck = req.headers.cookie
            const indexOfJWT = ck.indexOf("jwt")
            let jwtToken = ck.substr(indexOfJWT + 1)
            const idx = jwtToken.indexOf(";")
            if(idx == -1){
                jwtToken = jwtToken.split("=")[1]
            }
            else{
                jwtToken = jwtToken.substr(1, idx - 1)
            }

            const jwtStatus = await prisma.vulnSetting.findUnique({
                where: {
                    name: "JWT"
                }
            })
            const encodedHeader = jwtToken.split(".")[0]
            const decodedHeader = Buffer.from(encodedHeader, 'base64').toString('utf-8')
            const header = JSON.parse(decodedHeader)
            if(jwtStatus.status == "None-Alg" && header.alg == 'none') mysecretkey = null

            jwt.verify(jwtToken, mysecretkey, (err, decoded) => {
                if (err) {
                  return res.status(401).json({ message: 'Invalid token' });
                }
              });

            next()
        }
    }
    catch(err){
        console.log(err)
        return res.redirect('/page-login')
    }
}

export default Authentication