import express from "express";
import {
  getAllUsers,
  getUserById,
} from "../controllers/userController";
import {
  logIn,
  logout,
  signup,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", logIn);
router.get('/logout', logout);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUserById);

export default router;
