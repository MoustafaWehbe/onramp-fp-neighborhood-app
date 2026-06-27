import { Model, type Sequelize, type Optional } from "sequelize";
export interface RoleAttributes {
    id: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface RoleCreationAttributes extends Optional<RoleAttributes, "id" | "description"> {
}
export declare class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    id: string;
    name: string;
    description: string | undefined;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof Role;
}
