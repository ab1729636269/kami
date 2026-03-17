import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Log extends Model {
  public id!: number;
  public user_id!: number;
  public action!: string;
  public description!: string;
  public ip_address!: string;
  public created_at!: Date;
}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    ip_address: {
      type: DataTypes.STRING(50)
    }
  },
  {
    sequelize,
    tableName: 'logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

export default Log;