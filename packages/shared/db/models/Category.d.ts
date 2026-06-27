import { Model, type InferAttributes, type InferCreationAttributes, type CreationOptional, type Sequelize } from "sequelize";
export declare class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    id: CreationOptional<string>;
    name: string;
    slug: string;
    description: string | null;
    department: string | null;
    embedding: number[] | null;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
    static initModel(sequelize: Sequelize): typeof Category;
}
