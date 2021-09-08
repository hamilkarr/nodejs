const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "developmet";

const config = require("../config/config.json")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = { Sequelize: Sequelize, sequelize };

module.exports = db;
