import express from "express";

const shopErrorRoute = express.Router();

shopErrorRoute.get("/", (req, res) => {
  res.render("components/header");
});

export default shopErrorRoute;
