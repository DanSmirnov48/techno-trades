import { deleteFiles, getFileUrl, listFiles } from "../controllers/mediaController";
import express from "express";

const router = express.Router();

router.route("/listAllMedia").get(listFiles)
router.route("/getFileUrl").get(getFileUrl)
router.route("/deleteFiles").delete(deleteFiles);

export default router;