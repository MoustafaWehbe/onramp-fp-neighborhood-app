import { Model, type Sequelize, type Optional } from "sequelize";
export interface SessionAttributes {
    id: string;
    userId: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface SessionCreationAttributes extends Optional<SessionAttributes, "id" | "userAgent" | "ipAddress"> {
}
export declare class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    id: string;
    userId: string;
    userAgent: string | undefined;
    ipAddress: string | undefined;
    expiresAt: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof Session;
}
