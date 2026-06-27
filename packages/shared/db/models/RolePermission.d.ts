import { Model, type Sequelize } from "sequelize";
export interface RolePermissionAttributes {
    roleId: string;
    permissionId: string;
}
export declare class RolePermission extends Model<RolePermissionAttributes> implements RolePermissionAttributes {
    roleId: string;
    permissionId: string;
    static initModel(sequelize: Sequelize): typeof RolePermission;
}
