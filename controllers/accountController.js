import jwt from 'jsonwebtoken'
import {PrismaClient } from '@prisma/client' 
import fs from "fs"
import path from "path";
import bcrypt from "bcrypt"
import ejs from "ejs"
const prisma = new PrismaClient()

// [GET] /page-account
const getAccount = async (req, res) =>  {
  const token = req.cookies.jwt
  console.log(token)
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
          const lastname = userInfo[0].lastName
          return res.render('page-account', {userInfo: userInfo[0]})
        }
      }
    })
  }
  else res.redirect('/page-login')
}

// [POST] page/account
const setInfoAccount = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
      if (err) return res.status(500).send(err);
      let userId = result.id;
      const { firstname, lastname, email, password, newpassword, cpassword } = req.body;
      const user = await prisma.credential.findUnique({
        where: {
          id: userId
        }
      })
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.send("Mật khẩu sai");
      } else if (newpassword !== cpassword) {
        return res.send("Mật khẩu mới không trùng khớp");
      } else {
        // Check for blacklisted characters in firstname and lastname
        const blacklist = ['=', 'exec', 'execSync', 'localLoad', 'constructor'];
        let isBlacklisted = blacklist.some(char => firstname.includes(char) || lastname.includes(char));
        
        if (isBlacklisted) {
          return res.status(400).send("Kí tự không hợp lệ");
        } else {
          // Update userInfo and credential
          await prisma.userInfo.update({
            where: {
              userId: userId
            },
            data: {
              firstName: firstname,
              lastName: lastname,
              email: email
            }
          });
          if (newpassword) {
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            await prisma.credential.update({
              where: {
                userId: userId
              },
              data: {
                password: hashedPassword
              }
            });
          }
          
          // Check SSTI status and render profile
          const sstiStatus = await prisma.vulnSetting.findUnique({
            where: {
              name: "SSTI"
            }
          });
          if (sstiStatus && sstiStatus.status === true) {
            const userInfo = await prisma.$queryRaw`
              SELECT "UserInfo"."firstName", "UserInfo"."lastName", "UserInfo"."email", "UserInfo"."bio"
              FROM public."Credential"
              JOIN public."UserInfo" ON "Credential"."userId" = ${userId} AND "UserInfo"."userId" = ${userId}`;
            
            fs.readFile(path.join(__dirname, '../views', 'page-account.ejs'), 'utf8', (err, data) => {
              if (err) return res.status(500).send(err);
              
              let accountProfile = data.replace("<%= userInfo.lastName %>", lastname);
              // accountProfile = accountProfile.replace("<%= userInfo.firstName %>", firstname);
              
              const renderProfile = ejs.render(accountProfile, { userInfo: userInfo[0], info: { message: "Updated Successfully!" } });
              return res.send(renderProfile);
            });
          } else {
            return res.redirect('/page-account');
          }
        }
      }
    });
  } else {
    res.redirect('/page-login');
  }
};


export default { getAccount, setInfoAccount };
