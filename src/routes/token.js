import { Router } from "express";
import { checkToken } from "../middlewares/auth.js";
import { Token } from "../db.js";
import { randomBytes } from "crypto";
import { NotAllowedExeption } from "../misc/errors.js";

const router = Router();

router.get("/list", checkToken, async (req, res, next) => {
	try {
		if (req.user.uuid != "00000000-0000-0000-0000-000000000000")
			throw new NotAllowedExeption();

		let tokens = await Token.findAll({ attributes: ["uuid", "name"] });
		res.send(tokens);
	} catch (err) {
		next(err);
	}
});

router.post("/add", checkToken, async (req, res, next) => {
	try {
		if (req.user.uuid != "00000000-0000-0000-0000-000000000000")
			throw new NotAllowedExeption();

		const { name } = req.body;

		let token = await Token.build({
			name: name,
			token: randomBytes(16).toString("hex"),
		}).save();

		res.send(token);
	} catch (err) {
		next(err);
	}
});

router.delete("/delete/:uuid", checkToken, async (req, res, next) => {
	try {
		if (req.user.uuid != "00000000-0000-0000-0000-000000000000")
			throw new NotAllowedExeption();

		const { uuid } = req.params;

		await Token.destroy({ where: { uuid: uuid } });

		res.send({
			ok: true,
			method: "DELETE",
			path: "/tokens/delete/" + uuid,
			message: "deleted token " + uuid,
		});
	} catch (err) {
		next(err);
	}
});

export const tokenRouter = router;
