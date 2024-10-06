import { Model, DataTypes, Sequelize } from 'sequelize';
import { Payment } from './payment';

export class Payer extends Model {
  public id!: string;
  public payerName!: string;
  public order!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public payments?: Payment[];

  static initModel(sequelize: Sequelize): typeof Payer {
    Payer.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      payerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'payers',
    });

    return Payer;
  }

  static associateModel(): void {
    Payer.hasMany(Payment, {
      sourceKey: 'id',
      foreignKey: 'payerId',
      as: 'payments',
    });
  }
}
