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
import { Users } from "./Users";
import { ProductVariants } from "./ProductVariants";

@Table({
    tableName: "CartItems",
    timestamps: true,
    paranoid: true,
})
export class CartItems extends Model {

    @PrimaryKey
    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    user_id!: string;

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

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    is_selected!: boolean;

    @BelongsTo(() => Users)
    user!: Users;

    @BelongsTo(() => ProductVariants)
    variant!: ProductVariants;
}