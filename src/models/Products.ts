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
    shop_id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description!: string;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    view_count!: number;

    @BelongsTo(() => Shops)
    shop!: Shops;

    @ForeignKey(() => Categories)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    category_id!: string;

    @BelongsTo(() => Categories)
    category!: Categories;

    @HasMany(() => ProductVariants)
    variants!: ProductVariants[];

    @BelongsToMany(() => Users, () => Wishlists)
    wishlistedBy!: Users[];

    @BelongsToMany(() => Users, () => Likes)
    likedBy!: Users[];

    @HasMany(() => Ratings)
    ratings!: Ratings[];
}