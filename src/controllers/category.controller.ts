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

export const updateCtaegory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const categoryRepo = AppDataSource.getRepository(Category);
    const category = await categoryRepo.findOneBy({
      id: Number(req.params.id),
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category
    category.name = name;
    await categoryRepo.save(category);
    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryRepo = AppDataSource.getRepository(Category);
    const id = Number(req.params.id);

    // Check if category exists
    const category = await categoryRepo.findOneBy({ id });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the category
    await categoryRepo.remove(category);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
