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
    declare user_id: string;

    @PrimaryKey
    @ForeignKey(() => ProductVariants)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare variant_id: string;

    @Default(1)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare quantity: number;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare is_selected: boolean;

    @BelongsTo(() => Users)
    declare user: Users;

    @BelongsTo(() => ProductVariants)
    declare variant: ProductVariants;
}