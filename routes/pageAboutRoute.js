import express from "express";
import aboutController from "../controllers/aboutController";

const getAccount = express.Router();

getAccount.get("/", aboutController.aboutPage);

export default getAccount;
