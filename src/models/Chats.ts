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
    user_id!: string;

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
    message!: string;

    @BelongsTo(() => Users)
    user!: Users;

    @BelongsTo(() => Shops)
    shop!: Shops;
}