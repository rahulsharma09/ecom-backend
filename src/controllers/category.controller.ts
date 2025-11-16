import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entities/Category";

export const fetchCategories = async (req: Request, res: Response) => {
  try {
    const categoryRepo = AppDataSource.getRepository(Category);
    const categories = await categoryRepo.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const categoryRepo = AppDataSource.getRepository(Category);
    const category = categoryRepo.create({ name });
    await categoryRepo.save(category);
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
