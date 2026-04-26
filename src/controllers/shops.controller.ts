import { Request, Response } from "express";
import { Shops } from "../models/Shops";
import { Users } from "../models/Users";

const UPLOAD_FOLDER = "shops";

export class ShopsController {

  // ─────────────────────────────
  // GET ALL SHOPS
  // ─────────────────────────────
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

      return res.status(200).json({
        message: "Success",
        records: shops,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch shops",
        error,
      });
    }
  }

  // ─────────────────────────────
  // GET SHOP BY ID
  // ─────────────────────────────
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const shop = await Shops.findByPk(id as string, {
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["user_id", "first_name", "last_name", "profile_pic"],
          },
        ],
      });

      if (!shop) {
        return res.status(404).json({
          message: "Shop not found",
        });
      }

      return res.status(200).json({
        message: "Success",
        records: shop,
      });

    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch shop",
        error,
      });
    }
  }

  // ─────────────────────────────
  // CREATE SHOP
  // ─────────────────────────────
  static async create(req: Request, res: Response) {
    try {
      const { name, description, owner_id } = req.body;

      if (!name || !owner_id) {
        return res.status(400).json({
          message: "name and owner_id are required",
        });
      }

      // cek sudah punya shop
      const existingShop = await Shops.findOne({
        where: { owner_id },
      });

      if (existingShop) {
        return res.status(400).json({
          message: "User already has a shop",
        });
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const profile_pic = files?.profile_pic?.[0]
        ? `uploads/${UPLOAD_FOLDER}/${files.profile_pic[0].filename}`
        : null;

      const banner = files?.banner?.[0]
        ? `uploads/${UPLOAD_FOLDER}/${files.banner[0].filename}`
        : null;

      const shop = await Shops.create({
        name,
        description,
        owner_id,
        profile_pic,
        banner,
      });

      return res.status(201).json({
        message: "Shop created successfully",
        data: shop,
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to create shop",
        error,
      });
    }
  }

  static async getByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const shop = await Shops.findOne({
        where: { owner_id: userId },
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["user_id", "first_name", "last_name", "profile_pic"],
          },
        ],
      });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      return res.status(200).json({
        message: "Success",
        records: shop,
      });

    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch shop", error });
    }
  }

  // Add this method to ShopsController

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, owner_id } = req.body;

      if (!owner_id) {
        return res.status(400).json({ message: "owner_id is required" });
      }

      const shop = await Shops.findOne({
        where: { shop_id: id, owner_id },
      });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found or not yours" });
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const baseUrl = "http://localhost:5005/uploads";

      if (name) shop.name = name;
      if (description !== undefined) shop.description = description;

      if (files?.profile_pic?.[0]) {
        shop.profile_pic = `uploads/${baseUrl}/${UPLOAD_FOLDER}/${files.profile_pic[0].filename}`;
      }

      if (files?.banner?.[0]) {
        shop.banner = `uploads/${baseUrl}/${UPLOAD_FOLDER}/${files.banner[0].filename}`;
      }

      await shop.save();

      return res.status(200).json({
        message: "Shop updated successfully",
        data: shop,
      });

    } catch (error) {
      console.error("Update shop error:", error);
      return res.status(500).json({ message: "Failed to update shop", error });
    }
  }
}