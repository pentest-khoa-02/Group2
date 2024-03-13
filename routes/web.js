import checkOutRoute from "./checkOutRoute";
import indexRoute from "./indexRoute";
import shopCartRoute from "./shopCartRoute";
import shopCompareRoute from "./shopCompareRoute";
import shopErrorRoute from "./shopErrorRoute";

// Init all passport
// initPassportLocal();

const initWebRoutes = (app) => {
  app.use("/", indexRoute);
  app.use("/shop-cart", shopCartRoute);
  app.use("/shop-checkout", checkOutRoute);
  app.use("/shop-compare", shopCompareRoute);
  app.use("/page-404", shopErrorRoute);
};
export default initWebRoutes;
