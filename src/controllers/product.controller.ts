import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import pLimit from "p-limit";

export const fetchProducts = async (req: Request, res: Response) => {
  try {
    const productRepo = AppDataSource.getRepository(Product);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = req.query.sort === "desc" ? "DESC" : "ASC";
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;
    const query = productRepo
      .createQueryBuilder("product")
      .where("product.name ILIKE :search", {
        search: `%${search}%`,
      })
      .orderBy("product.price", sort)
      .skip(skip)
      .take(limit);
    const [products, total] = await query.getManyAndCount();
    return res.status(200).json({ products, total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const createProduct = async (req: any, res: Response) => {
  try {
    const { name, price, category_id } = req.body;
    console.log(req.body);
    const productRepo = AppDataSource.getRepository(Product);
    const imageUrl = req.file ? req.file.path : null;
    const product = productRepo.create({
      name,
      price,
      category: { id: Number(category_id) } as any,
      image: imageUrl,
    });
    await productRepo.save(product);
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const bulkCreateProducts = async (req: Request, res: Response) => {
  try {
    const products = req.body.products;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        message: "products should be an array",
      });
    }

    const productRepo = AppDataSource.getRepository(Product);

    // Limit to 5 concurrent DB inserts
    const limit = pLimit(5);

    const results = await Promise.all(
      products.map((item: any, index: number) =>
        limit(async () => {
          try {
            // Validate fields
            if (!item.name || !item.price || !item.category_id) {
              throw new Error("Missing required fields");
            }

            // No file upload here — image should be a URL from CSV
            const product = productRepo.create({
              name: item.name,
              price: Number(item.price),
              category: { id: Number(item.category_id) } as any,
              image: item.image || null,
            });

            const created = await productRepo.save(product);

            return {
              rowIndex: index + 1,
              status: "success",
              id: created.id,
            };
          } catch (err: any) {
            return {
              rowIndex: index + 1,
              status: "error",
              message: err.message || "Failed to create product",
            };
          }
        })
      )
    );

    return res.status(200).json({
      message: "Bulk upload completed",
      results,
    });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
