import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const Authentication = async (req, res, next) => {
    const mysecretkey = process.env.JWT_SECRET
    const prisma = new PrismaClient()
    console.log(req.path)
    try{
        if(req.path == '/page-login' || req.path == '/page-register' || req.path == '/settings' || req.path == '/page-register/createUser'){
            next()
        }
        else{
            const ck = req.headers.cookie
            let k = ck.indexOf(";")
            const tk = ck.substr(k + 1)
            const token = tk.split('=')[1];
            const jwtStatus = await prisma.vulnSetting.findUnique({
                where:{
                    name: "JWT"
                }
            })

            let decode;
            if(jwtStatus.status == "No"){
                decode = jwt.verify(token, mysecretkey)
            }
            else decode = jwt.decode(token)
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
        console.log(err)
        return res.redirect('/page-login')
    }
}

export default Authentication