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
router.route("/signup").post(signup);                                 //✔️
router.route("/login").post(logIn);                                   //✔️
router.route('/logout').get(logout);                                  //✔️
router.route("/validate").get(validateJWT);                           //✔️

// Password RESET and UPDATE for UNAUTHORIZED users
router.route("/forgot-password").post(forgotPassword);                //❌
router.route("/reset-password/:token").patch(resetPassword);          //❌

// Profile UPDATE for AUTHORIZED users
router.route("/update-my-password").patch(protect, updatePassword);   //✔️
router.route("/update-me").patch(protect, updateMe);                  //✔️
router.route("/deactivate-me").delete(protect, deleteMe);             //✔️

// Get CURRENT AUTHORIZED user
router.route("/me").get(protect, getMe, getCurentUser);               //❌ 

router.route("/").get(protect, restrictTo("admin"), getAllUsers);     //✔️

router.route("/:id").get(getUserById);                                //✔️

export default router;