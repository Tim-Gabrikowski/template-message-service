import { inspect } from "util";
// import all functions from the logger module to a single object
import * as logger from "./logger.js";

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

app.listen(process.env.PORT, () => {
	logger.info(
		"MAIN",
		"Listening on: " + "http://localhost:" + process.env.PORT
	);
});

process.on("uncaughtException", (error) => {
	logger.critical("MAIN", inspect(error));
});
