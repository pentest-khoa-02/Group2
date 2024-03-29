import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import path from "path";

const useAppConfig = (app, __dirname) => {
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "public")));
};

export default useAppConfig;
