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
    tableName: "Ratings",
    timestamps: true,
    paranoid: true,
})
export class Ratings extends Model {

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

    @Column({
        type: DataType.DECIMAL(2, 1),
        allowNull: false,
    })
    value!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    picture!: string;

    @BelongsTo(() => Users, {
        foreignKey: "user_id",
        as: "user",
    })
    user!: Users;

    @BelongsTo(() => Products)
    product!: Products;
}