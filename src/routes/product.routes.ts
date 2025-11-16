import { Router } from "express";
import {
  bulkCreateProducts,
  createProduct,
  fetchProducts,
} from "../controllers/product.controller";
import { uploadCloud } from "../middleware/cloudinaryUpload";

const router = Router();

router.get("/", fetchProducts);
router.post("/create", uploadCloud.single("image"), createProduct);
router.post("/bulk", bulkCreateProducts);

export default router;
