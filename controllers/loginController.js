import jsonwebtoken from 'jsonwebtoken'
import {PrismaClient } from '@prisma/client' 
import md5 from 'md5'
import loginService from "../services/loginService"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

const getPageLogin = (req, res) => {
  res.clearCookie("jwt")
  return res.render("page-login");
};

// const handleLogin = async (req, res) => {
//   const {username, password} = await req.body
//   try {
//     console.log(username)
//     let result = await prisma.$queryRaw`SELECT * FROM public."Credential" where username = ${username}`
//     if(result.length == 0 || md5(password) !== result[0].password){
//       const error = {
//         message: "User or Password is Incorrect!"
//       }
//       res.render("page-login", {error: error})
//     }
//     else{
//       const token = jsonwebtoken.sign(
//         { id: result[0].id, username: username },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );
//       res.cookie("jwt", token, {
//           httpOnly: true,
//           maxAge: 10000 * 1000
//       });
//       res.redirect("/page-account")
//     }
//     } catch (error) {
//     res.send("ERROR")
//   }
// }

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  try {
    let result = await prisma.$queryRaw`SELECT * FROM public."Credential" WHERE username = ${username}`;
    if (result.length === 0) {
      throw new Error("User or Password is Incorrect!");
    }
    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) {
      throw new Error("User or Password is Incorrect!");
    }
    const token = jsonwebtoken.sign(
      { id: result[0].id, username: username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
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