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
    declare order_id: string;         // ← was order_id:

    @PrimaryKey
    @ForeignKey(() => ProductVariants)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare variant_id: string;       // ← was variant_id:

    @Default(1)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare quantity: number;          // ← was quantity:

    // Relationships keep :
    @BelongsTo(() => Orders)
    declare order: Orders;

    @BelongsTo(() => ProductVariants)
    declare variant: ProductVariants;
}