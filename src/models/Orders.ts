import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
    HasMany
} from "sequelize-typescript";
import { Users } from "./Users";
import { Shops } from "./Shops";
import { Addresses } from "./Addresses";
import { OrderItems } from "./OrderItems";
import { VouchersUsed } from "./VouchersUsed";

@Table({
    tableName: "Orders",
    timestamps: true,
    paranoid: true,
})
export class Orders extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare order_id: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    customer_id!: string;

    @ForeignKey(() => Shops)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    shop_id!: string;

    @ForeignKey(() => Addresses)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    address_id!: string;

    @Column({
        type: DataType.ENUM("pending", "completed", "cancelled"),
        allowNull: false,
    })
    status!: "pending" | "completed" | "cancelled";

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
    })
    amount_paid!: number;

    @BelongsTo(() => Users)
    customer!: Users;

    @BelongsTo(() => Shops)
    shop!: Shops;

    @BelongsTo(() => Addresses)
    address!: Addresses;

    @HasMany(() => OrderItems)
    orderItems!: OrderItems[];

    @HasMany(() => VouchersUsed)
    vouchersUsed!: VouchersUsed[];
}