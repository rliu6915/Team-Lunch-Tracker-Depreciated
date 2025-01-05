import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/db';

// Define payer interface

interface PayerAttributes {
  id?: string;
  payerName: string;
  orderNumber: number;
}

export class Payer extends Model<PayerAttributes> implements PayerAttributes {
  public id?: string;
  public payerName!: string;
  public orderNumber!: number;
}

Payer.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    autoIncrement: true,
    defaultValue: DataTypes.UUIDV4,
  },
  payerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'payer',
});