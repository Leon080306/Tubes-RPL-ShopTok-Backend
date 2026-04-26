import { Request, Response } from "express";
import { Ratings } from "../models/Ratings";
import { Users } from "../models/Users";

export class RatingsController {
  static async getAll(req: Request, res: Response) {
    try {
      const ratings = await Ratings.findAll();

      res.json({
        message: "Success",
        records: ratings,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch ratings",
        error,
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rating = await Ratings.findByPk(id as string, {
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["first_name", "last_name"],
          },
        ],
      });

      res.json({
        message: "Success",
        record: rating,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch ratings",
        error,
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { user_id, product_id, value, title, description } = req.body;
      const file = (req as any).file;

      let imageUrl = null;
      if (file) {
        const folder = (req as any).uploadFolder ?? "ratings";
        imageUrl = `uploads/${folder}/${file.filename}`;
      }

      const [rating, created] = await Ratings.upsert({
        user_id,
        product_id,
        value,
        title,
        description,
        picture: imageUrl,
      });

      res.status(created ? 201 : 200).json(rating);
    } catch (error: any) {
      console.error("🔥 SEQUELIZE ERROR:", error);
      res.status(500).json({
        message: "Failed to create rating",
        error: error.message,
      });
    }
  }
}
