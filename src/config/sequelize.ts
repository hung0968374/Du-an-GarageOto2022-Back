import { Sequelize, Dialect } from 'sequelize';
import env from '../config/env';

const { database } = env;

export default new Sequelize(
  database.database,
  database.username,
  database.password,
  {
    dialect: database.dialect as Dialect,
    host: database.host,
    port: database.port,
    retry: { max: 3 },
    ssl: true,
  }
);
