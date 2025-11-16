import { Router } from "express";
import {
  bulkCreateProducts,
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../controllers/product.controller";
import { uploadCloud } from "../middleware/cloudinaryUpload";

const router = Router();

router.get("/", fetchProducts);
router.post("/create", uploadCloud.single("image"), createProduct);
router.post("/bulk", bulkCreateProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
