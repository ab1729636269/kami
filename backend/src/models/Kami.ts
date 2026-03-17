import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import KamiType from './KamiType';
import User from './User';

class Kami extends Model {
  public id!: number;
  public code!: string;
  public type_id!: number;
  public status!: 'unused' | 'used' | 'expired';
  public user_id!: number;
  public generated_at!: Date;
  public used_at!: Date;
  public expired_at!: Date;
  
  // 关联
  public kamitype?: KamiType;
  public user?: User;
}

Kami.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('unused', 'used', 'expired'),
      defaultValue: 'unused'
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    generated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    used_at: {
      type: DataTypes.DATE
    },
    expired_at: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'kamis',
    timestamps: false
  }
);

export default Kami;