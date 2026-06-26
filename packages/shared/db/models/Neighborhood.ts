import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type Sequelize,
} from "sequelize";

export class Neighborhood extends Model<
  InferAttributes<Neighborhood>,
  InferCreationAttributes<Neighborhood>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare city: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof Neighborhood {
    Neighborhood.init(
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
        city: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "neighborhoods",
        timestamps: true,
        underscored: true,
      }
    );

    return Neighborhood;
  }
}
