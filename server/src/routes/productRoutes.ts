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
import { authMiddleware, staff } from "../middlewares/auth";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(authMiddleware, staff, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(authMiddleware, staff, updateProduct)
  .delete(authMiddleware, staff, archiveProduct);

router.route("/archived-products").get(authMiddleware, staff, getArchivedProducts);
router.route("/unarchive-product").patch(authMiddleware, staff, unarchiveProduct);
router.route("/pp").get(getPaginatedProducts);
router.route("/filter").post(getFilteredProducts);
router.route("/search").get(searchProducts);
router.route("/:slug").get(getProductBySlug);
router.route("/:id/reviews").post(authMiddleware, createProductReview);
router.route("/update-stock").post(updateProductStock);
router.route("/update-multiple-stock").post(updateMultipleProducts);
router.route("/:id/update-discount").patch(authMiddleware, staff, setProductDiscount);

export default router;