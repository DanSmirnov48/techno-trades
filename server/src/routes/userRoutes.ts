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
  generateUserEmailChangeVerificationCode,
  // logIn,
  logInWithMagicLink,
  logout,
  magicLinkLogIn,
  protect,
  refreshAccessToken,
  resetPassword,
  restrictTo,
  // signup,
  updatePassword,
  updateUserEmail,
  validate,
  // verifyAccount,
  verifyPasswordResetCode,
} from "../controllers/authController";


import {
  logIn,
  register,
  verifyEmail,
  sendLoginOtp,
  logingWithOtp
} from "../controllers/auth";

const router = express.Router();

// User AUTHENTICATION
//new routes
router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/verify-email").post(verifyEmail);
router.route("/send-login-otp").get(sendLoginOtp);
router.route("/login-with-otp").post(logingWithOtp);

//old routes
router.route("/logout").get(logout);
router.route("/validate").get(validate);
router.route("/refresh-token").get(refreshAccessToken);

// Password RESET and UPDATE for UNAUTHORIZED users
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-password-reset-code").post(verifyPasswordResetCode);
router.route("/reset-forgotten-password").patch(resetPassword);
router.route("/request-email-change-verification-code")
  .get(protect, generateUserEmailChangeVerificationCode);

// Profile UPDATE for AUTHORIZED users
router.route("/update-my-password").patch(protect, updatePassword);
router.route("/update-user-email").post(protect, updateUserEmail);
router.route("/update-me").patch(protect, updateMe);
router.route("/deactivate-me").delete(protect, deleteMe);

// Get CURRENT AUTHORIZED user
router.route("/me").get(protect, getMe, getCurentUser);

router.route("/").get(protect, restrictTo("admin"), getAllUsers);

router.route("/:id").get(getUserById);

export default router;