import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";

@Table({
    tableName: "Categories",
    timestamps: true,
    paranoid: true,
})
export class Categories extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare category_id: string;

    @ForeignKey(() => Categories)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    parent_id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    icon!: string;

    // Parent Category
    @BelongsTo(() => Categories, "parent_id")
    parent!: Categories;

    // Child Categories
    @HasMany(() => Categories, "parent_id")
    children!: Categories[];
}