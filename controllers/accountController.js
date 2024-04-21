import jwt from 'jsonwebtoken'
import {PrismaClient } from '@prisma/client' 
import md5 from "md5"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

// [GET] /page-account
const getAccount = async (req, res) =>  {
  const token = req.cookies.jwt
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
      if(err) res.send(err)
      else{
        console.log(req.headers.cookie)
        console.log(jwt.decode(req.headers.cookie.split('=')[1]))
        let userId = result.id
        const userInfo = await prisma.$queryRaw`SELECT "UserInfo"."firstName", "UserInfo"."lastName", "UserInfo"."email", "UserInfo"."bio" from public."Credential" 
        JOIN public."UserInfo" ON "Credential"."userId" = ${userId} AND "UserInfo"."userId" = ${userId}`
        if(userInfo === null) res.send("No user")
        else{
          return res.render('page-account', {userInfo: userInfo[0]})
        }
      }
    })
  }
  else res.redirect('/page-login')
}

// [POST] page/account
const setInfoAccount = async (req, res) => {
  const token = req.cookies.jwt
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
      if(err) res.send(err)
      else{
        let userId = result.id
        const {firstname, lastname, email, password, newpassword, cpassword} = req.body
        const user = await prisma.credential.findUnique({
          where:{
            id: userId
          }
        })
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
          return res.send("Mat khau sai")
        }
        else if(newpassword !== cpassword){
          return res.send("Mat khau moi khong trung khop")
        }
        else{
          const userInfo = await prisma.userInfo.update({
            where: {
              userId: userId
            },
            data: {
              firstName: firstname,
              lastName: lastname,
              email: email
            }
          })
          const hashedPassword = await bcrypt.hash(newpassword, 10);
          const updateUser = await prisma.credential.update({
            where:{
              userId: userId
            },
            data: {
              password: hashedPassword
            }
          })
          console.log(userInfo)
        }
        
        return res.redirect('/page-account')
      }
    })
  }
  else res.redirect('/page-login')
}

export default { getAccount, setInfoAccount };
