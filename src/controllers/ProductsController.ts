import { Request, Response } from "express";
import { Products } from "../models/Products";
import { Ratings } from "../models/Ratings";
import { ProductVariants } from "../models/ProductVariants";
import { Categories } from "../models/Categories";
import { Users } from "../models/Users";
import { OrderItems } from "../models/OrderItems";
import { Shops } from "../models/Shops";

export class ProductsController {
  static async getAll(req: Request, res: Response) {
    try {
      const products = await Products.findAll({
        include: [
          {
            model: Ratings,
            as: "ratings",
            attributes: [
              "user_id",
              "product_id",
              "value",
              "title",
              "description",
              "picture",
              "createdAt",
            ],

            include: [
              {
                model: Users,
                as: "user",
                attributes: [
                  "user_id",
                  "first_name",
                  "last_name",
                  "profile_pic",
                ],
              },
            ],
          },

          {
            model: ProductVariants,
            attributes: [
              "variant_id",
              "product_id",
              "name",
              "picture",
              "stock",
              "price",
            ],

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

      res.json({
        message: "Success",
        records: products,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch products",
        error,
      });
    }
  }
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const products = await Products.findByPk(id as string, {
        include: [
          {
            model: Ratings,
            as: "ratings",
            attributes: [
              "user_id",
              "product_id",
              "value",
              "title",
              "description",
              "picture",
              "createdAt",
            ],

            include: [
              {
                model: Users,
                as: "user",
                attributes: [
                  "user_id",
                  "first_name",
                  "last_name",
                  "profile_pic",
                ],
              },
            ],
          },

          {
            model: ProductVariants,
            attributes: [
              "variant_id",
              "product_id",
              "name",
              "picture",
              "stock",
              "price",
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
          {
            model: Shops,
            as: "shop",
            attributes: ["shop_id", "name", "profile_pic"],
          },
        ],
      });

      res.json({
        message: "Success",
        records: products,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch products",
        error,
      });
    }
  }
}
