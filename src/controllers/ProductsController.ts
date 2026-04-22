import { Request, Response } from "express";
import { Products } from "../models/Products";
import { Ratings } from "../models/Ratings";
import { ProductVariants } from "../models/ProductVariants";

export class ProductsController{
  static async getAll(req: Request, res: Response) {
      try {
        const products = await Products.findAll({
          include: [
            {
              model: Ratings,
              attributes: ["user_id", "product_id", "value", "title", "description", "picture", "createdAt"],
            },
            {
              model: ProductVariants,
              attributes: ["variant_id", "product_id", "name", "picture", "stock", "price"],
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
  static async getById(req: Request, res: Response){
    try{
      const { id } = req.params;

      const products = await Products.findByPk(id as string,{
          include: [
            {
              model: Ratings,
              attributes: ["user_id", "product_id", "value", "title", "description", "picture", "createdAt"],
            },
            {
              model: ProductVariants,
              attributes: ["variant_id", "product_id", "name", "picture", "stock", "price"],
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