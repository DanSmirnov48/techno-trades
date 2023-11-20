import express from "express";
import {
  getAllUsers,
  getUserById,
} from "../controllers/userController";


const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/:id").get(getUserById);

export default router;
