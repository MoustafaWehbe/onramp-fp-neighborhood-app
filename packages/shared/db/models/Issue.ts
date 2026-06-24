import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface IssueAttributes {
  id: string;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
  address: string;
  status: "Reported" | "Acknowledged" | "In Progress" | "Resolved";
  reportedById: string;
  aiRoutingNote?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IssueCreationAttributes extends Optional<
  IssueAttributes,
  "id" | "aiRoutingNote"
> {}

export class Issue
  extends Model<IssueAttributes, IssueCreationAttributes>
  implements IssueAttributes
{
  declare id: string;
  declare title: string;
  declare description: string;
  declare category: string;
  declare neighborhood: string;
  declare address: string;
  declare status: "Reported" | "Acknowledged" | "In Progress" | "Resolved";
  declare reportedById: string;
  declare aiRoutingNote: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof Issue {
    Issue.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        neighborhood: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(
            "Reported",
            "Acknowledged",
            "In Progress",
            "Resolved",
          ),
          defaultValue: "Reported",
          allowNull: false,
        },
        reportedById: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        aiRoutingNote: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "issues",
        timestamps: true,
        underscored: true,
      },
    );
    return Issue;
  }
}
