import { Model, type Sequelize } from "sequelize";
export interface UserRoleAttributes {
    userId: string;
    roleId: string;
    assignedBy?: string;
    assignedAt?: Date;
}
export declare class UserRole extends Model<UserRoleAttributes> implements UserRoleAttributes {
    userId: string;
    roleId: string;
    assignedBy: string | undefined;
    assignedAt: Date;
    static initModel(sequelize: Sequelize): typeof UserRole;
}
