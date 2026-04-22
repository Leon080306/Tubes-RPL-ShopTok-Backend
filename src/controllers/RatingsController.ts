import { Request, Response } from "express";
import { Ratings } from "../models/Ratings";

export class RatingsController{
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
      const rating = await Ratings.findByPk(id as string);

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
}