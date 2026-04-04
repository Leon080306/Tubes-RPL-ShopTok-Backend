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
import { Products } from "./Products";
import { CartItems } from "./CartItems";
import { OrderItems } from "./OrderItems";

@Table({
    tableName: "ProductVariants",
    timestamps: true,
    paranoid: true,
})
export class ProductVariants extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare variant_id: string;

    @ForeignKey(() => Products)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    product_id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    picture!: string;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    stock!: number;

    @Default(0)
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    price!: number;

    @BelongsTo(() => Products)
    product!: Products;

    @HasMany(() => CartItems)
    cartItems!: CartItems[];

    @HasMany(() => OrderItems)
    orderItems!: OrderItems[];
}