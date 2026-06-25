import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface CommentAttributes {
  id: string;
  issueId: string;
  authorId: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentCreationAttributes extends Optional<
  CommentAttributes,
  "id"
> {}

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  declare id: string;
  declare issueId: string;
  declare authorId: string;
  declare body: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof Comment {
    Comment.init(
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
        authorId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        body: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "comments",
        timestamps: true,
        underscored: true,
      },
    );
    return Comment;
  }
}
