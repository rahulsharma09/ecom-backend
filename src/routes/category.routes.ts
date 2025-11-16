import { Router } from "express";
import {
  createCategory,
  fetchCategories,
} from "../controllers/category.controller";

const router = Router();

router.get("/", fetchCategories);
router.post("/create", createCategory);

export default router;
