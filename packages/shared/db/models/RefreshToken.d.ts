import { Model, type Sequelize, type Optional } from "sequelize";
export interface RefreshTokenAttributes {
    id: string;
    userId: string;
    sessionId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, "id" | "revokedAt"> {
}
export declare class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
    id: string;
    userId: string;
    sessionId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | undefined;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    get isExpired(): boolean;
    get isRevoked(): boolean;
    get isValid(): boolean;
    static initModel(sequelize: Sequelize): typeof RefreshToken;
}
