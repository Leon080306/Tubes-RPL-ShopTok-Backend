import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
    HasMany
} from "sequelize-typescript";
import { Addresses } from "./Addresses";
import { Wishlists } from "./Wishlists";
import { Products } from "./Products";
import { Likes } from "./Likes";
import { Ratings } from "./Ratings";
import { Chats } from "./Chats";
import { Notifications } from "./Notifications";
import { CartItems } from "./CartItems";
import { Orders } from "./Orders";

@Table({
    tableName: "Users",
    timestamps: true,
    paranoid: true,
})
export class Users extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare user_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    first_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    last_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phone_number!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    profile_pic!: string;

    @Default("customer")
    @Column({
        type: DataType.ENUM("admin", "customer", "seller"),
        allowNull: false,
    })
    role!: "admin" | "customer" | "seller";

    @Default("active")
    @Column({
        type: DataType.ENUM("active", "suspended"),
        allowNull: false,
    })
    status!: "active" | "suspended";

    @ForeignKey(() => Addresses)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    address_id!: string;

    @BelongsTo(() => Addresses)
    addresses!: Addresses;

    @BelongsToMany(() => Products, () => Wishlists)
    wishlist!: Products[];

    @BelongsToMany(() => Products, () => Likes)
    likedProducts!: Products[];

    @HasMany(() => Ratings)
    ratings!: Ratings[];

    @HasMany(() => Chats)
    chats!: Chats[];

    @HasMany(() => Notifications)
    notifications!: Notifications[];

    @HasMany(() => CartItems)
    cartItems!: CartItems[];

    @HasMany(() => Orders, "customer_id")
    orders!: Orders[];
}