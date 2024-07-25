// import all functions from the logger module to a single object
import * as logger from "./logger.js";

import { Sequelize, DataTypes, Model } from "sequelize";

// import and init dotenv (for environment files)
import dotenv from "dotenv";
dotenv.config();

const connection = new Sequelize({
	dialect: "sqlite",
	storage: "./data/db.sqlite",
	logging: (sql, timing) => {
		logger.debug("DATABASE", sql);
	},
});

try {
	await connection.authenticate();
	logger.info("DATABASE", "Connection to db successful");
} catch (error) {
	logger.critical("DATABASE", "Unable to connect to the database: " + error);
}

export class Token extends Model {}

Token.init(
	{
		uuid: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
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

export class Message extends Model {}

Message.init(
	{
		uuid: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		state: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		payload: {
			type: DataTypes.JSON,
			defaultValue: "",
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			defaultValue: "email",
			allowNull: false,
		},
		sendTo: {
			type: DataTypes.STRING,
			defaultValue: "",
			allowNull: false,
		},
		copyTo: {
			type: DataTypes.STRING,
			defaultValue: "",
			allowNull: false,
		},
	},
	{
		sequelize: connection,
		tableName: "messages",
	}
);

export class Template extends Model {}

Template.init(
	{
		uuid: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
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
		tableName: "templates",
	}
);

Template.hasMany(Message);
Message.belongsTo(Template);

logger.info("DATABASE", "BEGIN SYNC");
await connection.sync({ alter: true });
logger.info("DATABASE", "SYNC DONE");
