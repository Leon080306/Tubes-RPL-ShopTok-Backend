import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
} from "sequelize-typescript";
import { Vouchers } from "./Vouchers";
import { Orders } from "./Orders";

@Table({
    tableName: "VouchersUsed",
    timestamps: true,
    paranoid: true,
})
export class VouchersUsed extends Model {

    @PrimaryKey
    @ForeignKey(() => Vouchers)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    voucher_id!: string;

    @PrimaryKey
    @ForeignKey(() => Orders)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    order_id!: string;

    @BelongsTo(() => Vouchers)
    voucher!: Vouchers;

    @BelongsTo(() => Orders)
    order!: Orders;
}