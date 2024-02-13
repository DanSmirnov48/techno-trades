import express from "express";
import {
  getOrders,
  getMyOrders,
  updateShippingStatus,
  getOrdersBySessionId,
} from "../controllers/orderController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

router.route("/").get(protect, restrictTo("admin"), getOrders);

router.route("/my-orders").get(protect, getMyOrders);

router
  .route("/update-shipping-status")
  .post(protect, restrictTo("admin"), updateShippingStatus);

router.route("/:id").get(getOrdersBySessionId);

export default router;