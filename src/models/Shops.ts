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
import { Users } from "./Users";
import { Products } from "./Products";
import { Chats } from "./Chats";
import { Orders } from "./Orders";

@Table({
    tableName: "Shops",
    timestamps: true,
    paranoid: true,
})
export class Shops extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare shop_id: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare owner_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare description: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare profile_pic: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare banner: string;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare is_approved: boolean;

    @Default("active")
    @Column({
        type: DataType.ENUM("active", "suspended"),
        allowNull: false,
    })
    declare status: "active" | "suspended";

    @BelongsTo(() => Users, {
        foreignKey: "owner_id",
        as: "user",
    })
    declare owner: Users;

    @HasMany(() => Products)
    products!: Products[];

    @HasMany(() => Chats)
    chats!: Chats[];

    @HasMany(() => Orders)
    orders!: Orders[];
}