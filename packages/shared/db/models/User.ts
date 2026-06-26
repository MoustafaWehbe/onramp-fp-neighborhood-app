import { Model, DataTypes, type Sequelize, type Optional } from "sequelize";

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

export interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "passwordHash" | "googleId" | "emailVerified"
> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare email: string;
  declare passwordHash: string | null;
  declare name: string;
  declare googleId: string | null;
  declare emailVerified: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
        },
        passwordHash: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        googleId: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "google_id",
        },
        emailVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "users",
        timestamps: true,
        underscored: true,
      }
    );

    return User;
  }
}
