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

@Table({
    tableName: "Notifications",
    timestamps: true,
    paranoid: true,
})
export class Notifications extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare notification_id: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    user_id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    subject!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    message!: string;

    @BelongsTo(() => Users)
    user!: Users;
}