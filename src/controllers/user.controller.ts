import { Request, Response } from "express";
import { Users } from "../models/Users";
import { Addresses } from "../models/Addresses";
import bcrypt from "bcrypt";

export class UserController {
    static async getAll(req: Request, res: Response) {
        try {
            const users = await Users.findAll();

            if (users.length === 0) {
                res.status(404).json({ message: "No users exist" });
                return;
            }

            res.status(200).json({
                records: users
            });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await Users.findByPk(id as string);
            if (!user) { res.status(404).json({ message: "User not found" }); return; }
            await user.destroy();
            res.status(200).json({ message: "User deleted" });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await Users.findByPk(id as string)

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { first_name, last_name, email, rawPassword, phone_number, role } = req.body;

            const password = await bcrypt.hash(rawPassword, 10);

            const user = await Users.create({ first_name, last_name, email, password, phone_number, role });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { first_name, last_name, email, rawPassword, phone_number, role, status } = req.body;
            const { id } = req.params;

            const user = await Users.findByPk(id as string);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            if (first_name) user.first_name = first_name;
            if (last_name) user.last_name = last_name;
            if (email) user.email = email;
            if (rawPassword) {
                const password = await bcrypt.hash(rawPassword, 10);
                user.password = password;
            }
            if (phone_number) user.phone_number = phone_number;
            if (role) user.role = role;
            if (status) user.status = status;  // ← tambah ini

            await user.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async changePassword(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { oldPassword, newPassword } = req.body;

            const user = await Users.findByPk(id as string);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Password lama salah" });
                return;
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.status(200).json({ message: "Password berhasil diperbarui" });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}