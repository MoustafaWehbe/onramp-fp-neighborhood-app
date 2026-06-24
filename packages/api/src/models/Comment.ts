import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

export interface CommentAttributes {
  id: string;
  body: string;
  issueId: string;
  authorId: string;
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
  declare body: string;
  declare issueId: string;
  declare authorId: string;
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
        body: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        issueId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        authorId: {
          type: DataTypes.UUID,
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
