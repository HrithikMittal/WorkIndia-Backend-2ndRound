const Sequelize = require("sequelize");
const env = require("dotenv").config();

const dbHost = process.env.dbHost;
const dbUser = process.env.dbUser;
const dbName = process.env.dbName;
const dbPassword = process.env.dbPassword;
const dbPort = process.env.dbPort;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: "mysql",
  port: dbPort,
  host: dbHost,
  logging: false,
});

module.exports = sequelize;
