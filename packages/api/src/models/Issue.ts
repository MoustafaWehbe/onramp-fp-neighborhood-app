import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface IssueAttributes {
  id: string;
  title: string;
  description: string;
  category:
    | "Roads"
    | "Lighting"
    | "Utilities"
    | "Sanitation"
    | "Parks"
    | "Noise"
    | "Safety";
  neighborhood: string;
  address?: string | null;
  status: "Reported" | "Acknowledged" | "In Progress" | "Resolved";
  upvotes: number;
  aiRoutingNote?: string | null;
  submittedById: string;
  assignedToId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IssueCreationAttributes extends Optional<
  IssueAttributes,
  "id" | "upvotes" | "address" | "aiRoutingNote" | "assignedToId"
> {}

export class Issue
  extends Model<IssueAttributes, IssueCreationAttributes>
  implements IssueAttributes
{
  declare id: string;
  declare title: string;
  declare description: string;
  declare category:
    | "Roads"
    | "Lighting"
    | "Utilities"
    | "Sanitation"
    | "Parks"
    | "Noise"
    | "Safety";
  declare neighborhood: string;
  declare address: string | null;
  declare status: "Reported" | "Acknowledged" | "In Progress" | "Resolved";
  declare upvotes: number;
  declare aiRoutingNote: string | null;
  declare submittedById: string;
  declare assignedToId: string | null;
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
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        category: {
          type: DataTypes.ENUM(
            "Roads",
            "Lighting",
            "Utilities",
            "Sanitation",
            "Parks",
            "Noise",
            "Safety",
          ),
          allowNull: false,
        },
        neighborhood: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM(
            "Reported",
            "Acknowledged",
            "In Progress",
            "Resolved",
          ),
          allowNull: false,
          defaultValue: "Reported",
        },
        upvotes: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        aiRoutingNote: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        submittedById: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        assignedToId: {
          type: DataTypes.UUID,
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
