import express from "express";
import adminController from "../controllers/adminController";

const adminRoute = express.Router();

adminRoute.get("/", adminController.adminPage);

export default adminRoute;
