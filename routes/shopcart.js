import express from "express";
import shopCartController from "../controllers/shopCartController";
const shopCartRoute = express.Router()

shopCartRoute.get('/', shopCartController.getShopCart)
shopCartRoute.post('/add', shopCartController.addCart)

export default shopCartRoute