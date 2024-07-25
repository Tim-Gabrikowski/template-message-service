import { Token } from "../db.js";

// import and init dotenv (for environment files)
import dotenv from "dotenv";
dotenv.config();

export async function checkToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) {
		return res.status(401).send({ token: false, valid: false });
	}

	if (token == process.env.ADMIN_TOKEN) {
		req.user = { token: "ADMIN", name: "ADMIN", id: 0 };
		return next();
	}

	let db_token = await Token.findOne({ where: { token: token } });

	if (db_token == undefined || db_token == null)
		return res.status(401).send({ token: true, valid: false });

	req.user = db_token.dataValues;

	next();
}
