import { Router } from "express";
import {
  createProduct,
  fetchProducts,
} from "../controllers/product.controller";
import { uploadCloud } from "../middleware/cloudinaryUpload";

const router = Router();

router.get("/", fetchProducts);
router.post("/create", uploadCloud.single("image"), createProduct);

export default router;
