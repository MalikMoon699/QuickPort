import express from "express";
import {
  firstfunction,
  secondfunction,
  //others
} from "../Controllers/Name.controller.js";

const router = express.Router();

router.post("/<routeName>", firstfunction);
router.get("/<routeName>", secondfunction);
// others

export default router;
