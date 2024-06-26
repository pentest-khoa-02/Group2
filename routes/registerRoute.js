import express from "express";
import registerController from "../controllers/registerController";

const getPageRegister = express.Router();

getPageRegister.post("/createUser", registerController.createNewUser)
getPageRegister.get("/", registerController.getPageRegister);

//BUG: https://github.com/mde/ejs/issues/720
// indexRoute.get("/", (req, res) => {
//   res.render("author", req.query);
// });

export default getPageRegister;
