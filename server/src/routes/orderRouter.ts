import express from "express";
import {
    getOrders,
    getMyOrders,
} from "../controllers/orderController";
import { protect } from "../controllers/authController";

const router = express.Router();

router.route("/").get(getOrders)

router.route("/my-orders").get(protect, getMyOrders)

export default router;