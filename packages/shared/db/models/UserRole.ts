import { Model, DataTypes, type Sequelize } from "sequelize";

export interface UserRoleAttributes {
  userId: string;
  roleId: string;
  assignedBy?: string;
  assignedAt?: Date;
}

export class UserRole
  extends Model<UserRoleAttributes>
  implements UserRoleAttributes
{
  declare userId: string;
  declare roleId: string;
  declare assignedBy: string | undefined;
  declare assignedAt: Date;

  static initModel(sequelize: Sequelize): typeof UserRole {
    UserRole.init(
      {
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        roleId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        assignedBy: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        assignedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "user_roles",
        timestamps: false,
        underscored: true,
      }
    );

    return UserRole;
  }
}
