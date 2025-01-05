import { Model, DataTypes, Sequelize } from 'sequelize';
import { Payer } from './payer';

export class Payment extends Model {
  public id!: string;
  public payerId!: string;
  public restaurantName!: string;
  public paymentAmount!: number;
  public time!: Date;

  public payer?: Payer;

  static initModel(sequelize: Sequelize): typeof Payment {
    Payment.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      payerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      restaurantName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'payments',
      timestamps: false,
    });

    return Payment;
  }

  static associateModel(): void {
    Payment.belongsTo(Payer, {
      foreignKey: 'payerId',
      as: 'payer',
    });
  }
}


