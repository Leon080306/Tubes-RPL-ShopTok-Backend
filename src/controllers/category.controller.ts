import { Request, Response } from "express";
import { Categories } from "../models/Categories";
import { Products } from "../models/Products";

export class CategoryController {
    static async getAll(req: Request, res: Response) {
        try {
            const categories = await Categories.findAll({
                include: ["parent", "children"]
            });

            if (categories.length === 0) {
                res.status(404).json({ message: "No categories found" });
                return;
            }

            const categoriesWithCounts = await Promise.all(
                categories.map(async (category) => {
                    const totalProducts = await Products.count({
                        where: { category_id: category.category_id }
                    });

                    return {
                        ...category.toJSON(),
                        totalProducts
                    };
                })
            );

            res.status(200).json({
                records: categoriesWithCounts
            });

        } catch (error) {
            console.error("Categories error:", error);  // ✅ Better logging
            res.status(500).json({
                message: "Failed to fetch categories",
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const category = await Categories.findByPk(id as string, {
                include: ["parent", "children"]
            });

            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { name, parent_id } = req.body;

            const file = (req as any).file;

            const imageUrl = file
                ? `http://localhost:5005/uploads/categories/${file.filename}`
                : null;

            const category = await Categories.create({
                name,
                icon: imageUrl,
                parent_id: parent_id || null,
            });

            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, parent_id } = req.body;


            const category = await Categories.findByPk(id as string);

            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            const file = (req as any).file;

            if (file) {
                category.icon = `http://localhost:5005/uploads/categories/${file.filename}`;
            }

            if (name) category.name = name;
            if (parent_id !== undefined) {
                category.parent_id = parent_id === "null" ? null : parent_id;
            }

            await category.save();

            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ message: error });
            console.log(error);
        }
    }

    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const category = await Categories.findByPk(id as string);

            if (!category) {
                res.status(404).json({ message: "Category not found" });
                return;
            }

            await category.destroy();

            res.status(200).json({ message: "Category deleted" });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}