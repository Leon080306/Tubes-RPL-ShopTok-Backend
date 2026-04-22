import { Request, Response } from "express";
import { Users } from "../models/Users";
import { Addresses } from "../models/Addresses";
import bcrypt from "bcrypt";
1
export class AddressController {
    static async getByUserId(req: Request, res: Response) {
        try {
            const { user_id } = req.params;

            const [addresses, user] = await Promise.all([
                Addresses.findAll({ where: { user_id } }),
                Users.findByPk(user_id as string, { attributes: ["address_id"] }),
            ]);

            const result = addresses.map((addr) => ({
                ...addr.toJSON(),
                is_default: user?.address_id === addr.address_id,
            }));

            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const {
                user_id,
                full_name,
                address,
                province,
                city,
                sub_district,
                phone_number,
                is_default
            } = req.body;

            const newAddress = await Addresses.create({
                user_id,
                full_name,
                address,
                province,
                city,
                sub_district,
                phone_number,
            });

            if (is_default) {
                await Users.update(
                    { address_id: newAddress.address_id },
                    { where: { user_id } }
                );
            }

            res.status(201).json(newAddress);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { address_id } = req.params;
            const address = await Addresses.findByPk(address_id as string);
            if (!address) return res.status(404).json({ message: "Not found" });

            const isDefault = await Users.findOne({
                where: { address_id },
            });

            res.json({
                ...address.toJSON(),
                is_default: !!isDefault,
            });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { address_id } = req.params;
            const {
                user_id,
                full_name,
                address,
                province,
                city,
                sub_district,
                phone_number,
                is_default
            } = req.body;

            const existing = await Addresses.findByPk(address_id as string);
            if (!existing) {
                return res.status(404).json({ message: "Address not found" });
            }

            await existing.update({
                full_name,
                address,
                province,
                city,
                sub_district,
                phone_number,
            });

            if (is_default) {
                await Users.update(
                    { address_id },
                    { where: { user_id } }
                );
            }

            res.json(existing);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error });
        }
    }
}