// import all functions from the logger module to a single object
import * as logger from "./logger.js";

import { Sequelize, DataTypes, Model } from "sequelize";

// import and init dotenv (for environment files)
import dotenv from "dotenv";
dotenv.config();

const connection = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: "mysql",
		logging: (sql, timing) => {
			logger.debug("DATABASE", sql);
		},
	}
);

try {
	await connection.authenticate();
	logger.info("DATABASE", "Connection to db successful");
} catch (error) {
	logger.critical("DATABASE", "Unable to connect to the database: " + error);
}

export class Token extends Model {}

Token.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
	},
	{
		sequelize: connection,
		tableName: "tokens",
	}
);

logger.info("DATABASE", "BEGIN SYNC");
await connection.sync({ alter: true });
logger.info("DATABASE", "SYNC DONE");
