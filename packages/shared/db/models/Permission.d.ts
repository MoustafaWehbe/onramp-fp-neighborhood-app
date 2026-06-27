import { Model, type Sequelize, type Optional } from "sequelize";
export interface PermissionAttributes {
    id: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface PermissionCreationAttributes extends Optional<PermissionAttributes, "id" | "description"> {
}
export declare class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
    id: string;
    name: string;
    description: string | undefined;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof Permission;
}
