import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import ejs from "ejs";
import { readTemplateFile } from "../configs/template.conf";

const prisma = new PrismaClient();

// [GET] /page-account
const getAccount = async (req, res) => {
  const jwtStatus = await prisma.vulnSetting.findUnique({
    where:{
      name: "JWT"
    }
  })

  if(jwtStatus.status != "No"){
    const token = jwt.decode(req.cookies.jwt);
    console.log(token.id)
    try {
      const userId = token.id;
      const userInfo = await prisma.$queryRaw`
      SELECT "UserInfo"."firstName", "UserInfo"."lastName", "UserInfo"."email", "UserInfo"."bio"
      FROM public."Credential"
      JOIN public."UserInfo" ON "Credential"."userId" = ${userId} AND "UserInfo"."userId" = ${userId}`;

      if (!userInfo) {
        return res.send("No user");
      }
      const update = req.session.update
      delete req.session.update
      return res.render('page-account', { userInfo: userInfo[0], update: update});
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  else{
    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
      if (err) {
        return res.send(err);
      } else {
        try {
          const userId = token.id;
          const userInfo = await prisma.$queryRaw`
              SELECT "UserInfo"."firstName", "UserInfo"."lastName", "UserInfo"."email", "UserInfo"."bio"
              FROM public."Credential"
              JOIN public."UserInfo" ON "Credential"."userId" = ${userId} AND "UserInfo"."userId" = ${userId}`;

          if (!userInfo) {
            return res.send("No user");
          }
          const update = req.session.update
          delete req.session.update
          return res.render('page-account', { userInfo: userInfo[0], update: update});
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    });
  }
};

// [POST] page/account
const setInfoAccount = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, result) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        try {
          const userId = result.id;
          const { firstname, lastname, email, password, newpassword, cpassword } = req.body;
          const user = await prisma.credential.findUnique({
            where: {
              id: userId
            }
          });
          const isMatch = await bcrypt.compare(password, user.password);
          
          if (!isMatch) {
            return res.send("Mật khẩu sai");
          } else if (newpassword !== cpassword) {
            return res.send("Mật khẩu mới không trùng khớp");
          } else {
            const blacklist = ['=', 'sh', 'exec', 'execSync', 'localLoad', 'constructor'];
            const isBlacklisted = blacklist.some(char => firstname.includes(char) || lastname.includes(char));
            
            if (isBlacklisted) {
              return res.status(400).send("Kí tự không hợp lệ");
            } else {
              await prisma.userInfo.update({
                where: { userId: userId },
                data: { firstName: firstname, lastName: lastname, email: email }
              });

              if (newpassword) {
                const hashedPassword = await bcrypt.hash(newpassword, 10);
                await prisma.credential.update({
                  where: { userId: userId },
                  data: { password: hashedPassword }
                });
              }

              const sstiStatus = await prisma.vulnSetting.findUnique({
                where: { name: "SSTI" }
              });

              if (sstiStatus && sstiStatus.status === true) {
                const userInfo = await prisma.$queryRaw`
                  SELECT "UserInfo"."firstName", "UserInfo"."lastName", "UserInfo"."email", "UserInfo"."bio"
                  FROM public."Credential"
                  JOIN public."UserInfo" ON "Credential"."userId" = ${userId} AND "UserInfo"."userId" = ${userId}`;

                try {
                  const templateData = readTemplateFile(); // Sử dụng hàm đọc template từ templateConfig.js
                  let accountProfile = templateData.replace("<%= userInfo.lastName %>", lastname);
                  const renderProfile = ejs.render(accountProfile, { userInfo: userInfo[0], update: { message: "Updated Successfully!" } });
                  return res.send(renderProfile);
                } catch (error) {
                  return res.status(500).send(error);
                }
              } else {
                req.session.update = {message: "Updated Successfully!"};
                return res.redirect('/page-account');
              }
            }
          }
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    });
  } else {
    res.redirect('/page-login');
  }
};

export default { getAccount, setInfoAccount };
