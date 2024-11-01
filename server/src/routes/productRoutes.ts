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
  getFilteredProducts,
  searchProducts,
  createProductReview,
  updateProductStock,
  updateMultipleProducts,
  archiveProduct,
  getArchivedProducts,
  unarchiveProduct,
} from "../controllers/productController";
import { authMiddleware, admin, restrictTo } from "../middlewares/auth";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(authMiddleware, admin, createProduct);

router
  .route("/archived-products")
  .get(authMiddleware, admin, getArchivedProducts);

router
  .route("/unarchive-product")
  .patch(authMiddleware, restrictTo("admin", "user"), unarchiveProduct);

router.route("/pp").get(getPaginatedProducts);

router.route("/filter").post(getFilteredProducts);

router.route("/search").get(searchProducts);

router.route("/:slug").get(getProductBySlug);

router.route("/:id/reviews").post(authMiddleware, createProductReview);

router
  .route("/:id")
  .get(getProductById)
  .put(authMiddleware, admin, updateProduct)
  .delete(authMiddleware, admin, archiveProduct);

router.route("/update-stock").post(updateProductStock);

router.route("/update-multiple-stock").post(updateMultipleProducts);

router
  .route("/:id/update-discount")
  .patch(authMiddleware, restrictTo("admin", "user"), setProductDiscount);

export default router;