import express from "express";
import wishlistController from "../controllers/wishlistController";

const wishlist = express.Router();

wishlist.get("/", wishlistController.wishlist);

export default wishlist;
