import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    HasMany
} from "sequelize-typescript";
import { VouchersUsed } from "./VouchersUsed";

@Table({
    tableName: "Vouchers",
    timestamps: true,
    paranoid: true,
})
export class Vouchers extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare voucher_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    banner!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expiry_date!: Date;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
    })
    discount_value!: number;

    @HasMany(() => VouchersUsed)
    vouchersUsed!: VouchersUsed[];
}