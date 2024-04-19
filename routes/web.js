import errorHandler from "../middlewares/errorHandler";
import indexRoute from "./indexRoute";
import productRoute from "./productRoute";
import settingRoute from "./settingRoute";
import pageAccountRoute from "./pageAccountRoute"
import loginRoute from "./loginRoute";
import registerRoute from "./registerRoute"

// Init all passport
// initPassportLocal();

const initWebRoutes = (app) => {
  app.use("/", indexRoute);
  app.use("/product", productRoute);
  app.use("/settings", settingRoute);
  app.use("/page-account", pageAccountRoute)
  app.use("/page-login", loginRoute)
  app.use("/page-register", registerRoute)
  //app.use(errorHandler);
};

export default initWebRoutes;
