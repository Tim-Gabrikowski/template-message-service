import { inspect } from "util";
// import all functions from the logger module to a single object
import * as logger from "./logger.js";

import {
	IllegalArgumentException,
	NotFoundException,
	ConflictException,
	NotAllowedExeption,
} from "./misc/errors.js";

// import and init dotenv (for environment files)
import dotenv from "dotenv";
dotenv.config();

import Express from "express";
const app = Express();

// import and use cors
import cors from "cors";
app.use(cors());

app.use(Express.json());

// include main Router for main route
import { mainRouter } from "./routes/main.js";
app.use("/", mainRouter);
// include token Router for tokens route
import { tokenRouter } from "./routes/token.js";
app.use("/tokens", tokenRouter);

import { templateRouter } from "./routes/templates.js";
app.use("/templates", templateRouter);

import { messageRouter } from "./routes/messages.js";
app.use("/messages", messageRouter);

// Error Handling
app.use((err, req, res, next) => {
	switch (err.constructor) {
		case IllegalArgumentException:
			res.status(400).send({
				ok: false,
				method: req.method,
				path: req.path,
				error: "Illegal Argument: " + err.toString(),
			});
			break;
		case NotFoundException:
			res.status(404).send({
				ok: false,
				method: req.method,
				path: req.path,
				error: "Not Found: " + err.toString(),
			});
			break;
		case ConflictException:
			res.status(409).send({
				ok: false,
				method: req.method,
				path: req.path,
				error: "Conflict: " + err.toString(),
			});
			break;
		case NotAllowedExeption:
			res.status(403).send({
				ok: false,
				method: req.method,
				path: req.path,
				error: "Not Allowed: " + err.toString(),
			});
			break;
		default:
			logger.error("SERVER", "You fucked up somewhere: " + err);
			res.status(500).json({
				success: false,
				message: "InternalServerError: " + err.toString(),
			});
			break;
	}
});

app.listen(process.env.PORT, () => {
	logger.info(
		"MAIN",
		"Listening on: " + "http://0.0.0.0:" + process.env.PORT
	);
});

process.on("uncaughtException", (error) => {
	logger.critical("MAIN", inspect(error));
});
