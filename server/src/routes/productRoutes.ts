import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductBySlug,
    setProductDiscount,
    getPaginatedProducts,
} from "../controllers/productController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

router.route("/")
    .get(getProducts)
    .post(protect, restrictTo("admin"), createProduct);

router.route("/pp")
    .get(getPaginatedProducts)

router.route('/:slug')
    .get(getProductBySlug);

router.route("/:id")
    .get(getProductById)
    .put(protect, restrictTo("admin"), updateProduct)
    .delete(protect, restrictTo("admin"), deleteProduct);

router.route("/:id/update-discount")
    .patch(protect, restrictTo("admin", "user"), setProductDiscount)

export default router;