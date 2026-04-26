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
    declare customer_id: string;      // ← was customer_id:

    @ForeignKey(() => Shops)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare shop_id: string;          // ← was shop_id:

    @ForeignKey(() => Addresses)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare address_id: string;       // ← was address_id:

    @Column({
        type: DataType.ENUM("pending", "completed", "cancelled"),
        allowNull: false,
    })
    declare status: "pending" | "completed" | "cancelled";  // ← was status:

    @Column({
        type: DataType.DECIMAL(15, 2),
        allowNull: true,
    })
    declare amount_paid: number;      // ← was amount_paid:

    // Relationships stay the same
    @BelongsTo(() => Users)
    declare customer: Users;                 // ← relationship associations keep : (they're not columns)

    @BelongsTo(() => Shops)
    declare shop: Shops;

    @BelongsTo(() => Addresses)
    declare address: Addresses;

    @HasMany(() => OrderItems)
    declare orderItems: OrderItems[];

    @HasMany(() => VouchersUsed)
    declare vouchersUsed: VouchersUsed[];

}