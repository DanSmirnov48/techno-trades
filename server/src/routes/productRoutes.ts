import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
} from "../controllers/productController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

router.route("/")
    .get(getProducts)
    .post(protect, restrictTo("admin"), createProduct);

router.route("/:id")
    .get(getProductById)
    .put(protect, restrictTo("admin"), updateProduct)
    .delete(protect, restrictTo("admin"), deleteProduct);

export default router;