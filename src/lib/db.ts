// lib/db.ts
require('dotenv').config()
import { Sequelize } from 'sequelize-typescript';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in the environment variables')
} else {
  console.log('DATABASE_URL is exist')
}

// // export const sequelize = new Sequelize({
//   database: databaseUrl,
//   dialect: 'postgres',
//   dialectModule: pg,
//   storage: ':memory:',
//   models: [__dirname + '/**/*.model.ts']
// });
export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectModule: pg,
  storage: ':memory:',
  models: [__dirname + '/**/*.model.ts']
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};