import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    Default,
} from "sequelize-typescript";
import { Orders } from "./Orders";
import { ProductVariants } from "./ProductVariants";

@Table({
    tableName: "OrderItems",
    timestamps: true,
    paranoid: true,
})
export class OrderItems extends Model {

    @PrimaryKey
    @ForeignKey(() => Orders)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    order_id!: string;

    @PrimaryKey
    @ForeignKey(() => ProductVariants)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    variant_id!: string;

    @Default(1)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity!: number;

    @BelongsTo(() => Orders)
    order!: Orders;

    @BelongsTo(() => ProductVariants)
    variant!: ProductVariants;
}