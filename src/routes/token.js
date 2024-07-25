import { Router } from "express";
import { checkToken } from "../middlewares/auth.js";
import { Token } from "../db.js";
import { randomBytes } from "crypto";

const router = Router();

router.get("/list", checkToken, async (req, res) => {
	if (req.user.id != 0)
		return res.status(403).send({
			ok: false,
			method: "GET",
			path: "/tokens/list",
			error: "not allowed",
		});

	let tokens = await Token.findAll({ attributes: ["id", "name"] });
	res.send(tokens);
});

router.post("/add", checkToken, async (req, res) => {
	if (req.user.id != 0)
		return res.status(403).send({
			ok: false,
			method: "GET",
			path: "/tokens/list",
			error: "not allowed",
		});

	const { name } = req.body;

	let token = await Token.build({
		name: name,
		token: randomBytes(16).toString("hex"),
	}).save();

	res.send(token);
});

router.delete("/delete/:id", checkToken, async (req, res) => {
	if (req.user.id != 0)
		return res.status(403).send({
			ok: false,
			method: "GET",
			path: "/tokens/list",
			error: "not allowed",
		});
	const { id } = req.params;

	await Token.destroy({ where: { id: id } });

	res.send({
		ok: true,
		method: "DELETE",
		path: "/tokens/delete/" + id,
		message: "deleted token " + id,
	});
});

export const tokenRouter = router;
