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
    declare parent_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare icon: string;

    // Parent Category
    @BelongsTo(() => Categories, "parent_id")
    declare parent: Categories;

    // Child Categories
    @HasMany(() => Categories, "parent_id")
    declare children: Categories[];
}