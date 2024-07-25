import { Router } from "express";
import { checkToken } from "../middlewares/auth.js";
import { Token } from "../db.js";
import { randomBytes } from "crypto";
import { NotAllowedExeption } from "../misc/errors.js";

const router = Router();

router.get("/list", checkToken, async (req, res, next) => {
	try {
		if (req.user.id != 0) throw new NotAllowedExeption();

		let tokens = await Token.findAll({ attributes: ["id", "name"] });
		res.send(tokens);
	} catch (err) {
		next(err);
	}
});

router.post("/add", checkToken, async (req, res, next) => {
	try {
		if (req.user.id != 0) throw new NotAllowedExeption();

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

router.delete("/delete/:id", checkToken, async (req, res, next) => {
	try {
		if (req.user.id != 0) throw new NotAllowedExeption();

		const { id } = req.params;

		await Token.destroy({ where: { id: id } });

		res.send({
			ok: true,
			method: "DELETE",
			path: "/tokens/delete/" + id,
			message: "deleted token " + id,
		});
	} catch (err) {
		next(err);
	}
});

export const tokenRouter = router;
