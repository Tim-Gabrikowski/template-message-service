import { Router } from "express";
import { checkToken } from "../middlewares/auth.js";
import { Template } from "../db.js";
import { NotFoundException, ConflictException } from "../misc/errors.js";

const router = Router();

router.get("/list", checkToken, async (req, res) => {
	res.json(await Template.findAll());
});

router.get("/get/:uuid", checkToken, async (req, res, next) => {
	try {
		let t = await Template.findByPk(req.params.uuid);

		if (!t)
			throw new NotFoundException(
				"Template '" + req.params.uuid + "' not found"
			);

		res.send(t);
	} catch (err) {
		next(err);
	}
});
router.get("/name/:name", checkToken, async (req, res, next) => {
	try {
		let t = await Template.findOne({ where: { name: req.params.name } });

		if (!t)
			throw new NotFoundException(
				"Template '" + req.params.name + "' not found"
			);

		res.send(t);
	} catch (err) {
		next(err);
	}
});

router.post("/new", checkToken, async (req, res, next) => {
	try {
		let t = Template.build({
			name: req.body.name,
			content: req.body.content,
		});
		await t.save();
		res.send(t);
	} catch (err) {
		if ((err = "SequelizeUniqueConstraintError"))
			return next(
				new ConflictException(
					"Name: " + req.body.name + " already in use"
				)
			);

		next(err);
	}
});

router.put("/edit/:uuid", checkToken, async (req, res, next) => {
	try {
		let t = await Template.findByPk(req.params.uuid);

		if (!t)
			throw new NotFoundException(
				"Template '" + req.params.uuid + "' not found"
			);

		t.set(req.body);

		await t.save({ fields: ["name", "content"] });

		res.send(t);
	} catch (err) {
		next(err);
	}
});

export const templateRouter = router;
