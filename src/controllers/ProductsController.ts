import { Request, Response } from "express";
import { Products } from "../models/Products";
import { Ratings } from "../models/Ratings";
import { ProductVariants } from "../models/ProductVariants";
import { Categories } from "../models/Categories";
import { Users } from "../models/Users";
import { OrderItems } from "../models/OrderItems";
import { Shops } from "../models/Shops";

const BASE_URL = "http://localhost:5005/uploads/products";

export class ProductsController {

  // ─────────────────────────────
  // GET ALL
  // ─────────────────────────────
  static async getAll(req: Request, res: Response) {
    try {
      const products = await Products.findAll({
        include: [
          {
            model: Ratings,
            as: "ratings",
            attributes: ["user_id", "product_id", "value", "title", "description", "picture", "createdAt"],
            include: [
              {
                model: Users,
                as: "user",
                attributes: ["user_id", "first_name", "last_name", "profile_pic"],
              },
            ],
          },
          {
            model: ProductVariants,
            attributes: ["variant_id", "product_id", "name", "picture", "stock", "price"],
            include: [
              {
                model: OrderItems,
                attributes: ["order_id", "variant_id", "quantity"],
              },
            ],
          },
          {
            model: Categories,
            as: "category",
            include: [
              {
                model: Categories,
                as: "parent",
                attributes: ["category_id", "name", "icon"],
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        message: "Success",
        records: products,
      });

    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch products", error });
    }
  }

  // ─────────────────────────────
  // GET BY ID
  // ─────────────────────────────
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await Products.findByPk(id as string, {
        include: [
          {
            model: Ratings,
            as: "ratings",
            attributes: ["user_id", "product_id", "value", "title", "description", "picture", "createdAt"],
            include: [
              {
                model: Users,
                as: "user",
                attributes: ["user_id", "first_name", "last_name", "profile_pic"],
              },
            ],
          },
          {
            model: ProductVariants,
            attributes: ["variant_id", "product_id", "name", "picture", "stock", "price"],
          },
          {
            model: Categories,
            as: "category",
            include: [
              {
                model: Categories,
                as: "parent",
                attributes: ["category_id", "name", "icon"],
              },
            ],
          },
          {
            model: Shops,
            as: "shop",
            attributes: ["shop_id", "name", "profile_pic"],
          },
        ],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({
        message: "Success",
        records: product,
      });

    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch product", error });
    }
  }

  // ─────────────────────────────
  // CREATE
  // ─────────────────────────────
  static async create(req: Request, res: Response) {
    try {
      const { name, description, category_id, user_id, variants } = req.body;

      // ─── Validation ───────────────────────────────────────────
      if (!name || !description || !category_id || !user_id) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // ─── Lookup shop by user ───────────────────────────────────
      const shop = await Shops.findOne({ where: { owner_id: user_id } });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found for this user" });
      }

      // ─── Parse variants ────────────────────────────────────────
      let parsedVariants: any[] = [];
      try {
        parsedVariants = JSON.parse(variants);
      } catch {
        return res.status(400).json({ message: "Invalid variants format" });
      }

      if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
        return res.status(400).json({ message: "Variants must be a non-empty array" });
      }

      // ─── Create product ────────────────────────────────────────
      const product = await Products.create({
        name,
        description,
        category_id,
        shop_id: shop.shop_id,
      });

      // ─── Create variants with images ───────────────────────────
      const files = (req.files as Express.Multer.File[]) || [];

      const createdVariants = await Promise.all(
        parsedVariants.map((v, i) =>
          ProductVariants.create({
            product_id: product.product_id,
            name: v.name,
            price: v.price,
            stock: v.stock,
            picture: files[i] ? `${BASE_URL}/${files[i].filename}` : "",
          })
        )
      );

      return res.status(201).json({
        message: "Product created successfully",
        product,
        variants: createdVariants,
      });

    } catch (error) {
      console.error("Create product error:", error);
      return res.status(500).json({ message: "Failed to create product", error });
    }

  }
  // ─────────────────────────────
  // UPDATE
  // ─────────────────────────────
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, category_id, variants } = req.body;

      const product = await Products.findByPk(id as string);
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (name) product.name = name;
      if (description) product.description = description;
      if (category_id) product.category_id = category_id;
      await product.save();

      if (variants) {
        let parsedVariants: any[] = [];
        try { parsedVariants = JSON.parse(variants); } catch {
          return res.status(400).json({ message: "Invalid variants format" });
        }

        const files = (req.files as Express.Multer.File[]) || [];

        // ─── Delete removed variants ───────────────────────────
        const submittedIds = parsedVariants
          .map(v => v.variant_id)
          .filter(Boolean);

        const existingVariants = await ProductVariants.findAll({
          where: { product_id: id },
        });

        const toDelete = existingVariants.filter(
          ev => !submittedIds.includes(ev.variant_id)
        );

        await Promise.all(toDelete.map(ev => ev.destroy()));

        // ─── Upsert remaining variants ─────────────────────────
        await Promise.all(
          parsedVariants.map(async (v) => {
            const file = v.fileIndex !== null && v.fileIndex !== undefined
              ? files[v.fileIndex]
              : null;

            const pictureUrl = file
              ? `${BASE_URL}/${file.filename}`
              : v.existingPicture || "";

            if (v.variant_id) {
              await ProductVariants.update(
                { name: v.name, price: v.price, stock: v.stock, picture: pictureUrl },
                { where: { variant_id: v.variant_id } }
              );
            } else {
              await ProductVariants.create({
                product_id: product.product_id,
                name: v.name,
                price: v.price,
                stock: v.stock,
                picture: pictureUrl,
              });
            }
          })
        );
      }

      return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Update product error:", error);
      return res.status(500).json({ message: "Failed to update product", error });
    }
  }
}