// lib/db.ts
import { Sequelize } from 'sequelize-typescript';
import { Payer } from '../models/payer';
import { Payment } from '../models/payment';

const sequelize = new Sequelize({
  database: 'your_nextjs_app',
  dialect: 'postgres',
  username: 'your_username',
  password: 'your_password',
  models: [Payer, Payment], // Point to your models
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;
