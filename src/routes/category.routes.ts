import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCtaegory,
} from "../controllers/category.controller";

const router = Router();

router.get("/", fetchCategories);
router.post("/create", createCategory);
router.put("/update/:id", updateCtaegory);
router.delete("/delete/:id", deleteCategory);

export default router;
