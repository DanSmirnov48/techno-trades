import express from "express";
import {
  logIn,
  register,
  verifyEmail,
  resendVerificationEmail,
  sendLoginOtp,
  logingWithOtp,
  sendPasswordResetOtp,
  setNewPassword,
  validate,
  logout,
} from "../controllers/auth";
import { authMiddleware, admin } from "../middlewares/auth";
import {
  updatePassword,
  sendUserEmailChangeOtp,
  updateUserEmail,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserById,
} from "../controllers/user";

const router = express.Router();

// User AUTHENTICATION
router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/logout").get(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/resend-verification-email").post(resendVerificationEmail);
router.route("/validate").get(validate);
router.route("/forgot-password").post(sendPasswordResetOtp);
router.route("/set-new-password").post(setNewPassword);
router.route("/send-login-otp").get(sendLoginOtp);
router.route("/login-with-otp").post(logingWithOtp);

router.route("/send-email-change-otp").get(authMiddleware, sendUserEmailChangeOtp);
router.route("/update-my-email").patch(authMiddleware, updateUserEmail);
router.route("/update-my-password").patch(authMiddleware, updatePassword);
router.route("/update-me").patch(authMiddleware, updateMe);
router.route("/deactivate-me").delete(authMiddleware, deleteMe);

router.route("/:id").get(getUserById);
router.route("/").get(authMiddleware, admin, getAllUsers);

export default router;