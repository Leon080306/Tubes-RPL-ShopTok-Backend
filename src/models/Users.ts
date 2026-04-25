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
    declare first_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare last_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare phone_number: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare profile_pic: string;

    @Default("customer")
    @Column({
        type: DataType.ENUM("admin", "customer", "seller"),
        allowNull: false,
    })
    declare role: "admin" | "customer" | "seller";

    @Default("active")
    @Column({
        type: DataType.ENUM("active", "suspended"),
        allowNull: false,
    })
    declare status: "active" | "suspended";

    @Column({ type: DataType.STRING, allowNull: true })
    declare reset_token: string;

    @Column({ type: DataType.DATE, allowNull: true })
    declare reset_token_expiry: Date;

    @ForeignKey(() => Addresses)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare address_id: string;

    @BelongsTo(() => Addresses)
    declare addresses: Addresses;

    @BelongsToMany(() => Products, () => Wishlists)
    declare wishlist: Products[];

    @BelongsToMany(() => Products, () => Likes)
    declare likedProducts: Products[];

    @HasMany(() => Ratings)
    declare ratings: Ratings[];

    @HasMany(() => Chats)
    declare chats: Chats[];

    @HasMany(() => Notifications)
    declare notifications: Notifications[];

    @HasMany(() => CartItems)
    declare cartItems: CartItems[];

    @HasMany(() => Orders, "customer_id")
    declare orders: Orders[];
}