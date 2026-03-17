import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class KamiType extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public length!: number;
  public prefix!: string;
  public suffix!: string;
  public validity_days!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

KamiType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    length: {
      type: DataTypes.INTEGER,
      defaultValue: 16
    },
    prefix: {
      type: DataTypes.STRING(10)
    },
    suffix: {
      type: DataTypes.STRING(10)
    },
    validity_days: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    }
  },
  {
    sequelize,
    tableName: 'kami_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default KamiType;