import express from "express";
import useAppConfig from "./configs/app.conf.js";
import "dotenv/config";
import initWebRoutes from "./routes/web.js";
import session from "express-session"
import flash from "connect-flash"
require("dotenv").config();
import passport from "passport";


const app = express();
const port = process.env.APP_PORT || 3000;

app.use(flash());

useAppConfig(app, __dirname);



initWebRoutes(app);



app.listen(port, () => {
  console.log(`Express started on port http://localhost:${port}`);
});
