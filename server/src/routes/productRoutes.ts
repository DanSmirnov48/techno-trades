import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
} from "../controllers/productController";

const router = express.Router();

router.route("/")
    .get(getProducts)
    .post(createProduct);

router.route("/:id")
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

export default router;