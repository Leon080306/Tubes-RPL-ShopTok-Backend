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
import { Orders } from "./Orders";

@Table({
    tableName: "Addresses",
    timestamps: true,
    paranoid: true,
})
export class Addresses extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare address_id: string;

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
    full_name!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    address!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    province!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    sub_district!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    phone_number!: string;

    @BelongsTo(() => Users)
    user!: Users;

    @HasMany(() => Orders)
    orders!: Orders[];
}