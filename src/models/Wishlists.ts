import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
} from "sequelize-typescript";
import { Users } from "./Users";
import { Products } from "./Products";

@Table({
    tableName: "Wishlists",
    timestamps: true,
    paranoid: true,
    updatedAt: false, // since migration only has createdAt
})
export class Wishlists extends Model {

    @PrimaryKey
    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    user_id!: string;

    @PrimaryKey
    @ForeignKey(() => Products)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    product_id!: string;

    @BelongsTo(() => Users)
    user!: Users;

    @BelongsTo(() => Products)
    product!: Products;
}