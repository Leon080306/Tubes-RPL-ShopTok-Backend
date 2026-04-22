import { Request, Response } from "express";
import { Products } from "../models/Products";
import { Ratings } from "../models/Ratings";
import { ProductVariants } from "../models/ProductVariants";
import { Categories } from "../models/Categories";
import { Users } from "../models/Users";
import { Shops } from "../models/Shops";

export class ShopsController {
  static async getAll(req: Request, res: Response) {
    try {
      const shops = await Shops.findAll({
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["user_id", "first_name", "last_name", "profile_pic"],
          },
        ],
      });

      res.json({
        message: "Success",
        records: shops,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch shops",
        error,
      });
    }
  }
  
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const shops = await Shops.findByPk(id as string, {
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["user_id", "first_name", "last_name", "profile_pic"],
          },
        ],
      });

      res.json({
        message: "Success",
        records: shops,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch shop",
        error,
      });
    }
  }
}
