import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const Authentication = async (req, res) => {
    const mysecretkey = process.env.JWT_SECRET
    const prisma = new PrismaClient()
    try{
        if(req.path == '/page-login' || req.path == '/page-register' || req.path == '/settings'){
            console.log(1)
            next()
        }
        else{
            console.log(2)
            const token = req.headers.cookie.split('=')[1];
            const decode = jwt.verify(token, mysecretkey)
            const id = decode.id
            console.log(id)
            const result = await prisma.credential.findUnique({
                where: {
                    id: id
                },
            })
            if (result != null){
                next()
            }
        }
    }
    catch(err){
        console.log(3)
        return res.redirect('/page-login')
    }
}

export default Authentication