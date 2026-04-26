import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
    BelongsToMany
} from "sequelize-typescript";
import { Shops } from "./Shops";
import { Categories } from "./Categories";
import { HasMany } from "sequelize-typescript";
import { ProductVariants } from "./ProductVariants";
import { Users } from "./Users";
import { Wishlists } from "./Wishlists";
import { Likes } from "./Likes";
import { Ratings } from "./Ratings";

@Table({
    tableName: "Products",
    timestamps: true,
    paranoid: true,
})
export class Products extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare product_id: string;

    @ForeignKey(() => Shops)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare shop_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare description: string;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare view_count: number;

    @BelongsTo(() => Shops)
    declare shop: Shops;

    @ForeignKey(() => Categories)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare category_id: string;

    @BelongsTo(() => Categories, {
        foreignKey: "category_id",
        as: "category",
    })
    declare category: Categories;

    @HasMany(() => ProductVariants)
    declare variants: ProductVariants[];

    @BelongsToMany(() => Users, () => Wishlists)
    declare wishlistedBy: Users[];

    @BelongsToMany(() => Users, () => Likes)
    declare likedBy: Users[];

    @HasMany(() => Ratings, {
        foreignKey: "product_id",
        as: "ratings",
    })
    declare ratings: Ratings[];
}