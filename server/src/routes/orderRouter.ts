import express from "express";
import {
    getOrders,
    getMyOrders,
    updateShippingStatus,
    getOrdersBySessionId
} from "../controllers/orderController";
import { protect } from "../controllers/authController";

const router = express.Router();

router.route("/").get(getOrders)

router.route("/my-orders").get(protect, getMyOrders)

router.route("/update-shipping-status").post(updateShippingStatus)

router.route("/:id").get(getOrdersBySessionId)

export default router;