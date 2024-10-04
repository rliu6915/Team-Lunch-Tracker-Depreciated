// src/models/payment.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Payer } from './payer';

@Table({
  tableName: 'payments',
  timestamps: false,
})
export class Payment extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @ForeignKey(() => Payer)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  payerId!: string;

  @BelongsTo(() => Payer)
  payer!: Payer;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  restaurantName!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  paymentAmount!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  time!: Date;
}



