import { Model, type InferAttributes, type InferCreationAttributes, type CreationOptional, type Sequelize } from "sequelize";
export declare class Neighborhood extends Model<InferAttributes<Neighborhood>, InferCreationAttributes<Neighborhood>> {
    id: CreationOptional<string>;
    name: string;
    slug: string;
    city: string;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    static initModel(sequelize: Sequelize): typeof Neighborhood;
}
