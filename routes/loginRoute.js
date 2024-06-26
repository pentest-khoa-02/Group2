import express from "express";
import loginController from "../controllers/loginController";
const getPageLogin = express.Router();

getPageLogin.get("/", loginController.getPageLogin)
getPageLogin.post("/", loginController.handleLogin)

//BUG: https://github.com/mde/ejs/issues/720
// indexRoute.get("/", (req, res) => {
//   res.render("author", req.query);
// });

export default getPageLogin;
