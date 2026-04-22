import { Request, Response } from "express"
import { Vouchers } from "../models/Vouchers"
import { VouchersUsed } from "../models/VouchersUsed"
import { Op } from "sequelize"

export class VoucherController {
    // get all voc yg belum expiered
    static async getAvailableVouchers(req: Request, res: Response) {
        try {
            const now = new Date()
            const vouchers = await Vouchers.findAll({
                where: {
                    expiry_date: {
                        [Op.gt]: now // expiry_date > now. Op = operator. gt = greater than
                    }
                }
            })
            res.json({
                data: vouchers
            })
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    // validate sblm cekout
    static async validateVoucher(req: Request, res: Response) {
        try {
            const { name } = req.body
            const user_id = (req as any).user.id
            const now = new Date()

            // nyari voc berdasarkan nama
            const voucher = await Vouchers.findOne({ 
                where: { name: name } 
            })

            if (!voucher) {
                return res.status(404).json({
                    message: "Voucher tidak ditemukan"
                })
            }

            // cek tgl expired
            if (voucher.expiry_date < now) {
                return res.status(400).json({
                    message: "Voucher sudah expired"
                })
            }

            // cek usernya udh pernah pake blm
            // kan connect ke Orders -> join buat cek user_id
            const alreadyUsed = await VouchersUsed.findOne({
                where: { voucher_id: voucher.voucher_id },
                include: [{
                    model: require("../models/Orders").Orders,
                    where: { user_id: user_id }
                }]
            })

            // logicnya : 1 voc 1x pake per user
            if (alreadyUsed) {
                return res.status(400).json({
                    message: "Kamu pernah pakai voucher ini"
                })
            }

            res.json({
                message: "Voucher bisa digunakan",
                data: {
                    voucher_id: voucher.voucher_id,
                    name: voucher.name,
                    discount: voucher.discount_value
                }
            })
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
}