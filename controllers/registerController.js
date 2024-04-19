import registerService from "../services/registerService";
import { validationResult } from "express-validator";

const getPageRegister = (req, res) => {
  return res.render("page-register", {
    errors: req.flash("errors"),
  });
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
    req.flash("errors", errorsArr);
    return res.redirect("/page-register");
  }

  //create a new user
  const newUser = {
    username: req.body.username,
    hasher: req.body.bcrypt,
    password: req.body.hashedPassword,
    passwordSalt: req.body.hashedPassword
  };
  try {
    await registerService.createNewUser(newUser);
    return res.redirect("/page-login");
  } catch (err) {
    req.flash("errors", err);
    return res.redirect("/page-register");
  }
};
export default {
  getPageRegister,
  createNewUser,
};
