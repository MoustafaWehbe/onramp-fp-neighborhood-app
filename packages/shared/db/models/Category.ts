import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
} from "sequelize";

export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare department: string | null;
  declare embedding: number[] | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof Category {
    Category.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING(140),
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        department: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        embedding: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "categories",
        timestamps: true,
        underscored: true,
      }
    );

    return Category;
  }
}
