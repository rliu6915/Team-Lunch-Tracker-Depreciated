// src/models/payer.ts
import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Payment } from './payment';

@Table
export class Payer extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  payerName!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order!: number;

  @HasMany(() => Payment)
  payments!: Payment[];
}

