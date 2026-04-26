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
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare banner: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare expiry_date: Date;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
    })
    declare discount_value: number;

    @HasMany(() => VouchersUsed)
    declare vouchersUsed: VouchersUsed[];
}