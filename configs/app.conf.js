import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import path from "path";
import session from "express-session"

const useAppConfig = (app, __dirname) => {
  app.set("views", path.join(__dirname, "/views"));
  app.set("view engine", "ejs");
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "/public")));
  app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  }));
};

export default useAppConfig;
