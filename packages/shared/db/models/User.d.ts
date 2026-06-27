import { Model, type Sequelize, type Optional } from "sequelize";
export interface UserAttributes {
    id: string;
    email: string;
    passwordHash: string | null;
    name: string;
    googleId?: string | null;
    emailVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "passwordHash" | "googleId" | "emailVerified"> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: string;
    email: string;
    passwordHash: string | null;
    name: string;
    googleId: string | null;
    emailVerified: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof User;
}
