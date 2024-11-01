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
  logout
} from "../controllers/auth";

const router = express.Router();

// User AUTHENTICATION
router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/logout").get(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/resend-verification-email").post(resendVerificationEmail);
router.route("/send-login-otp").get(sendLoginOtp);
router.route("/login-with-otp").post(logingWithOtp);
router.route("/send-password-reset-otp").post(sendPasswordResetOtp);
router.route("/set-new-password").post(setNewPassword);
router.route("/validate").get(validate);

// router.route("/request-email-change-verification-code").get(protect, generateUserEmailChangeVerificationCode);
// router.route("/update-my-password").patch(protect, updatePassword);
// router.route("/update-user-email").post(protect, updateUserEmail);
// router.route("/update-me").patch(protect, updateMe);
// router.route("/deactivate-me").delete(protect, deleteMe);
// router.route("/me").get(protect, getMe, getCurentUser);
// router.route("/").get(protect, restrictTo("admin"), getAllUsers);
// router.route("/:id").get(getUserById);

export default router;