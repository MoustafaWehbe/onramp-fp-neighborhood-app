import { Model, DataTypes, type Sequelize } from "sequelize";

export interface RolePermissionAttributes {
  roleId: string;
  permissionId: string;
}

export class RolePermission
  extends Model<RolePermissionAttributes>
  implements RolePermissionAttributes
{
  declare roleId: string;
  declare permissionId: string;

  static initModel(sequelize: Sequelize): typeof RolePermission {
    RolePermission.init(
      {
        roleId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        permissionId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: "role_permissions",
        timestamps: false,
        underscored: true,
      }
    );

    return RolePermission;
  }
}
