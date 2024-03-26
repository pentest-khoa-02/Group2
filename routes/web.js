import indexRoute from "./indexRoute";
import dynamicRoute from "./dynamicRoute";

// Init all passport
// initPassportLocal();

const initWebRoutes = (app) => {
  app.use("/", indexRoute);

};


export default initWebRoutes;
