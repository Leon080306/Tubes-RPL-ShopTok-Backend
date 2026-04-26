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
    declare user_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare full_name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare address: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare province: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare city: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare sub_district: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare phone_number: string;

    @BelongsTo(() => Users)
    declare user: Users;

    @HasMany(() => Orders)
    declare orders: Orders[];
}
