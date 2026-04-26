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
    declare product_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare picture: string;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare stock: number;

    @Default(0)
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    declare price: number;

    @BelongsTo(() => Products)
    declare product: Products;

    @HasMany(() => CartItems)
    declare cartItems: CartItems[];

    @HasMany(() => OrderItems)
    declare orderItems: OrderItems[];
}