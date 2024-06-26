import express from "express";
import accountController from "../controllers/accountController";

const getAccount = express.Router();

getAccount.get("/", accountController.getAccount);
getAccount.post("/password", accountController.setPassword);
getAccount.post("/", accountController.setInfoAccount)

//BUG: https://github.com/mde/ejs/issues/720
// indexRoute.get("/", (req, res) => {
//   res.render("author", req.query);
// });

export default getAccount;
