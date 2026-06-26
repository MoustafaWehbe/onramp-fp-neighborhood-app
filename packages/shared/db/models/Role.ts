import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface RoleAttributes {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleCreationAttributes extends Optional<
  RoleAttributes,
  "id" | "description"
> {}

export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  declare id: string;
  declare name: string;
  declare description: string | undefined;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof Role {
    Role.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "roles",
        timestamps: true,
        underscored: true,
      }
    );

    return Role;
  }
}
