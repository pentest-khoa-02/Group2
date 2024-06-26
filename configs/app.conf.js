import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import path from "path";
import xmlparser from "express-xml-bodyparser"
import session from "express-session"
// const bodyParser = require('body-parser');
// require('body-parser-xml')(bodyParser)
import bodyParser from "body-parser"

const useAppConfig = (app, __dirname) => {
  app.use(bodyParser.text({ type: ['text/xml', 'application/xml'] }))
  // app.use(xmlparser())
  app.set("views", path.join(__dirname, "/views"));
  app.set("view engine", "ejs");
  // app.use(morgan("dev"));
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
