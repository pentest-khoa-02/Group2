import express from "express";
import vendorCardController from "../controllers/vendorCardController";

const vendorCard = express.Router();

vendorCard.get("/", vendorCardController.vendorcard);

export default vendorCard;
