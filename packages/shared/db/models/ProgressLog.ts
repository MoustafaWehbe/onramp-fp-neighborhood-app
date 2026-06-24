import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface ProgressLogAttributes {
  id: string;
  issueId: string;
  changedById: string;
  fromStatus: string;
  toStatus: string;
  note: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProgressLogCreationAttributes extends Optional<
  ProgressLogAttributes,
  "id"
> {}

export class ProgressLog
  extends Model<ProgressLogAttributes, ProgressLogCreationAttributes>
  implements ProgressLogAttributes
{
  declare id: string;
  declare issueId: string;
  declare changedById: string;
  declare fromStatus: string;
  declare toStatus: string;
  declare note: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof ProgressLog {
    ProgressLog.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        issueId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        changedById: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        fromStatus: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        toStatus: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        note: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "progress_logs",
        timestamps: true,
        underscored: true,
      },
    );
    return ProgressLog;
  }
}
