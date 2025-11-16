import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import { AppDataSource } from "./data-source";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  try {
    res.send("API is running...");
  } catch (error) {
    console.error(error);
  }
});

// Auth routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

AppDataSource.initialize().then(() => {
  console.log("DB Connected");

  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/products", productRoutes);

  app.listen(5000, () => console.log("Server running"));
});
