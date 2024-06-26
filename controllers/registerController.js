import registerService from "../services/registerService";
import { validationResult } from "express-validator";

const getPageRegister = (req, res) => {
  return res.render("page-register");
};

const createNewUser = async (req, res) => {
  //validate required fields
  const errorsArr = [];
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorsArr.push(item.msg);
    });
    // req.flash("errors", errorsArr);
    // return res.redirect("/page-register");
  }

  //create a new user
   const username = req.body.username
   const email = req.body.email
   const password = req.body.password
  try {
    await registerService.createNewUser(username, email, password);
    req.session.info = {message: "Register successfully! Please login"}
    return res.redirect("/page-login");
  } catch (err) {
    console.log(err)
    return res.redirect("/page-register");
  }
};
export default {
  getPageRegister,
  createNewUser,
};