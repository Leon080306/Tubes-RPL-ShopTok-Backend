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
    tableName: "Likes",
    timestamps: true,
    paranoid: true,
    updatedAt: false,
})
export class Likes extends Model {

    @PrimaryKey
    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare user_id: string;

    @PrimaryKey
    @ForeignKey(() => Products)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare product_id: string;

    @BelongsTo(() => Users)
    declare user: Users;

    @BelongsTo(() => Products)
    declare product: Products;
}