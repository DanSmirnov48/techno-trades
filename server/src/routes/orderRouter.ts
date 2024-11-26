import express from "express";
import {
  getOrders,
  getMyOrders,
  updateShippingStatus,
  getOrdersBySessionId,
} from "../controllers/orderController";
import { staff, authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(authMiddleware, staff, getOrders);
router.route("/my-orders").get(authMiddleware, getMyOrders);
router.route("/update-shipping-status").post(authMiddleware, staff, updateShippingStatus);
router.route("/:id").get(getOrdersBySessionId);

export default router;