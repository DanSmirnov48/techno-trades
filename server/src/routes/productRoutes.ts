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
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, restrictTo("admin"), createProduct);

router
  .route("/archived-products")
  .get(protect, restrictTo("admin"), getArchivedProducts);

router
  .route("/unarchive-product")
  .patch(protect, restrictTo("admin", "user"), unarchiveProduct);

router.route("/pp").get(getPaginatedProducts);

router.route("/filter").post(getFilteredProducts);

router.route("/search").get(searchProducts);

router.route("/:slug").get(getProductBySlug);

router.route("/:id/reviews").post(protect, createProductReview);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, restrictTo("admin"), updateProduct)
  .delete(protect, restrictTo("admin"), archiveProduct);

router.route("/update-stock").post(updateProductStock);

router.route("/update-multiple-stock").post(updateMultipleProducts);

router
  .route("/:id/update-discount")
  .patch(protect, restrictTo("admin", "user"), setProductDiscount);

export default router;