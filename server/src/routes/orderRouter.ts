import express from "express";
import {
  getOrders,
  getMyOrders,
  updateShippingStatus,
  getOrdersBySessionId,
} from "../controllers/orderController";
import { admin, authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(authMiddleware, admin, getOrders);
router.route("/my-orders").get(authMiddleware, getMyOrders);
router
  .route("/update-shipping-status")
  .post(authMiddleware, admin, updateShippingStatus);
router.route("/:id").get(getOrdersBySessionId);

export default router;