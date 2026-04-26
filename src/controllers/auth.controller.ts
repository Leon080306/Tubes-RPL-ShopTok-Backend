import { Request, Response } from "express";
import { Users } from "../models/Users";
import { Addresses } from "../models/Addresses";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { createTransporter } from "../utils/mailer";
import nodemailer from "nodemailer";

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ where: { email } });

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid password" });
                return;
            }

            // ─── Suspension check ─────────────────────────────
            if (user.status === "suspended") {
                res.status(403).json({
                    message: "Your account has been suspended. Please contact support for assistance.",
                    suspended: true,
                });
                return;
            }
            // ──────────────────────────────────────────────────

            res.cookie("user", JSON.stringify({
                user_id: user.user_id,
                first_name: user.first_name,
                role: user.role
            }), {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            res.status(200).json({
                message: "Login successful",
                user: user
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            res.clearCookie("user");
            res.status(200).json({ message: "Logout successful" });
            console.log("Logout successful");
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async register(req: Request, res: Response) {
        try {
            console.log(req.body);
            const { first_name, last_name, email, rawPassword, phone_number, role } = req.body;

            const password = await bcrypt.hash(rawPassword, 10);

            const user = await Users.create({ first_name, last_name, email, password: password, phone_number, role });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error });
            console.log(error);
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const user = await Users.findOne({ where: { email } });
            if (!user) {
                // Don't reveal whether email exists
                return res.json({ message: "If that email exists, a reset link has been sent." });
            }

            const token = crypto.randomBytes(32).toString("hex");
            const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

            user.reset_token = token;
            user.reset_token_expiry = expiry;
            await user.save();

            const resetLink = `http://localhost:5173/reset-password?token=${token}`;

            const { transporter } = await createTransporter();

            const info = await transporter.sendMail({
                from: '"Support" <support@yourapp.com>',
                to: user.email,
                subject: "Password Reset Request",
                html: `
                    <p>Hi ${user.first_name},</p>
                    <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>If you didn't request this, ignore this email.</p>
                `,
            });

            console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

            res.json({ message: "If that email exists, a reset link has been sent." });
        } catch (error) {
            res.status(500).json({ message: error });
            throw error;
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;

            const user = await Users.findOne({ where: { reset_token: token } });

            if (!user || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            user.reset_token = null!;
            user.reset_token_expiry = null!;
            await user.save();

            res.json({ message: "Password reset successfully" });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}