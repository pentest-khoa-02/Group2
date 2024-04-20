import jwt from 'jsonwebtoken'
import {PrismaClient } from '@prisma/client' 
const prisma = new PrismaClient()

const getAccount = async (req, res) =>  {
  const token = req.cookies.jwt
  jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
    if(err) res.send(err)
    else{
      let userId = result.id
      console.log(userId)
      const userInfo = await prisma.$queryRaw`SELECT "UserInfo"."firstName", "UserInfo"."lastName", "UserInfo"."email" from public."Credential" 
      JOIN public."UserInfo" ON "Credential"."userId" = 1 AND "UserInfo"."userId" = 1`
      if(userInfo === null) res.send("No user")
      else{
        console.log(userInfo[0].firstName)
        return res.render('page-account', {userInfo: userInfo[0]})
      }
    }
  })
}

export default { getAccount };
