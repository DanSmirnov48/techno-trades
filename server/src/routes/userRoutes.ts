import express from "express";
import {
  deleteMe,
  getMe,
  getAllUsers,
  getUserById,
  updateMe,
  getCurentUser,
} from "../controllers/userController";
import {
  forgotPassword,
  logIn,
  logout,
  protect,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
  validateJWT,
} from "../controllers/authController";

const router = express.Router();

// User AUTHENTICATION
router.post("/signup", signup);
router.post("/login", logIn);
router.get('/logout', logout);
router.get("/validate", validateJWT);

// Password RESET and UPDATE for UNAUTHORIZED users
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Profile UPDATE for AUTHORIZED users
router.patch("/update-my-password", protect, updatePassword);
router.patch("/update-me", protect, updateMe);
router.delete("/deactivate-me", protect, deleteMe);

// Get CURRENT AUTHORIZED user
router.get("/me", protect, getMe, getCurentUser);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUserById);

export default router;