import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient()

const getPageLogin = (req, res) => {
  res.clearCookie("jwt")  
  if(typeof(req.session) == "undefined"){
    return res.render("page-login");
  }
  else{
    const info = req.session.info
    delete req.session.info
    return res.render("page-login", {info: info})
  }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    let result = await prisma.$queryRaw`SELECT * FROM public."Credential" WHERE username = ${username}`;
    if (result.length === 0) {
      throw new Error("User or Password is Incorrect!");
    }
    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) {
      throw new Error("User or Password is Incorrect!");
    }

    const jwtStatus = await prisma.vulnSetting.findUnique({
      where: {
        name: "JWT"
      }
    });

    let header = {
      alg: 'HS256',
      typ: 'JWT'
    }
    const token = jwt.sign(
      { id: result[0].id, username: username, isAdmin: false },
      process.env.JWT_SECRET,
      {expiresIn: '5d', header}
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 10000 * 1000
    });
    res.redirect("/page-account");
  } catch (error) {
    res.render("page-login", { error: { message: error.message } });
  }
};


export default {
  getPageLogin,
  handleLogin
}