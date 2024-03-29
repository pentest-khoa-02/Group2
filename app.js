import express from "express";
import useAppConfig from "./configs/AppConfig.js";
import "dotenv/config";
import initWebRoutes from "./routes/web.js";
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3000;

useAppConfig(app, __dirname);
initWebRoutes(app);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("page-404", { error: err });
}

app.listen(port, () => {
  console.log(`Express started on port http://localhost:${port}`);
});
