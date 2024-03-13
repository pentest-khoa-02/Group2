import { validationResult } from "express-validator";
import loginService from "../Services/loginService";

let getPageLogin = (req, res) => {
  return res.render("login", {
    errors: req.flash("errors"),
  });
};

let handleLogin = async (req, res) => {
  let errorsArr = [];
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorsArr.push(item.msg);
    });
    req.flash("errors", errorsArr);
    return res.redirect("/login");
  }

  try {
    await loginService.handleLogin(req.body.email, req.body.password);
    return res.redirect("/");
  } catch (err) {
    req.flash("errors", err);
    return res.redirect("/login");
  }
};

let checkLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};

let checkLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};

let postLogOut = (req, res) => {
  req.session.destroy(function (err) {
    return res.redirect("/login");
  });
};

export default {
  getPageLogin,
  handleLogin,
  checkLoggedIn,
  checkLoggedOut,
  postLogOut,
};
