import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const getPageLogin = (req, res) => {
  res.clearCookie("jwt");
  if (typeof req.session === "undefined") {
    return res.render("page-login");
  } else {
    const info = req.session.info;
    delete req.session.info;
    return res.render("page-login", { info: info });
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

    let header;
    let key;
    let token;

    const jwtStatus = await prisma.vulnSetting.findUnique({
      where: { name: "JWT" },
    });

    if (jwtStatus.status === "Algo-Confusion" || jwtStatus.status === "No") {
      header = {
        alg: 'RS256',
        typ: 'JWT',
        kid: "fbdafd16-cc6a-4e21-8924-6531343f7a49",
      };
      key = fs.readFileSync(path.join(__dirname, "../helper/key/privateKey.pem"), 'utf-8');
      token = jwt.sign(
        { id: result[0].id, username: username, isAdmin: false },
        key,
        { algorithm: 'RS256', header }
      );
    }
    else if (jwtStatus.status === "Weak-Key") {
      header = {
        alg: 'HS256',
        typ: 'JWT',
      };

      const secretsFilePath = path.join(__dirname, '../helper/key/jwt.txt');
      const secrets = fs.readFileSync(secretsFilePath, 'utf8').split('\n').filter(secret => secret.trim() !== '');

      const randomIndex = Math.floor(Math.random() * secrets.length);
      const jwtsecret = secrets[randomIndex];
      // Write the selected jwtsecret to another file
      const usedSecretsFilePath = path.join(__dirname, '../helper/key/used_jwt.txt');
      fs.writeFileSync(usedSecretsFilePath, jwtsecret);

      token = jwt.sign(
        { id: result[0].id, username: username, isAdmin: false },
        jwtsecret,
        { expiresIn: '1h', header}
      );
    }
    else {
      token = jwt.sign(
        { id: result[0].id, username: username, isAdmin: false },
        process.env.JWT_SECRET,
        { expiresIn: '5d', header }
      );
    }

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 10000 * 1000,
    });
    return res.redirect("/");
  } catch (error) {
    res.render("page-login", { error: { message: error.message } });
  }
};

export default {
  getPageLogin,
  handleLogin,
};
