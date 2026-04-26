import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Users } from "./Users";
import { Shops } from "./Shops";

@Table({
    tableName: "Chats",
    timestamps: true,
    paranoid: true,
})
export class Chats extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare chat_id: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare user_id: string;

    @ForeignKey(() => Shops)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare shop_id: string;

    @Default("customer")
    @Column({
        type: DataType.ENUM("customer", "seller"),
        allowNull: false,
    })
    declare sender_role: "customer" | "seller";

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare message: string;

    @BelongsTo(() => Users)
    declare user: Users;

    @BelongsTo(() => Shops)
    declare shop: Shops;
}