import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import path from "path";
import session from "express-session"
import xmlparser from "express-xml-bodyparser"
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser)

const useAppConfig = (app, __dirname) => {
  app.set("views", path.join(__dirname, "/views"));
  app.set("view engine", "ejs");
  // app.use(morgan("dev"));
  // app.use(xmlparser)
  app.use(bodyParser.xml({
    limit: '1MB', // Giới hạn kích thước body
    xmlParseOptions: {
        explicitArray: false
    }
}));
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
