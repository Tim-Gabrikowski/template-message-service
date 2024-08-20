import { Router } from "express";
import { checkToken } from "../middlewares/auth.js";
import { Template, Message } from "../db.js";
import { NotFoundException } from "../misc/errors.js";
import { renderMessage } from "../misc/renderer.js";
import { sendMail } from "../misc/mailsender.js";

const router = Router();

router.get("/list", checkToken, async (req, res) => {
	res.json(await Message.findAll());
});

router.get("/get/:uuid", checkToken, async (req, res, next) => {
	try {
		let t = await Message.findByPk(req.params.uuid, {
			include: [Template],
		});

		if (!t)
			throw new NotFoundException(
				"Message '" + req.params.uuid + "' not found"
			);

		res.send(t);
	} catch (err) {
		next(err);
	}
});

router.post("/new", checkToken, async (req, res, next) => {
	try {
		// find Template requested
		let t = await Template.findByPk(req.body.template);
		if (!t)
			throw new NotFoundException(
				"Template '" + req.body.template + "' not found"
			);

		// create Message Object
		let m = await Message.build({
			payload: req.body.payload,
			type: req.body.type,
			title: req.body.title,
			TemplateUuid: t.uuid,
		}).save();

		res.send(m);
	} catch (err) {
		next(err);
	}
});

router.get("/render/:uuid", checkToken, async (req, res, next) => {
	try {
		let m = await Message.findByPk(req.params.uuid);
		if (!m)
			throw new NotFoundException(
				"Message '" + req.params.uuid + "' not found"
			);

		let t = await Template.findByPk(m.TemplateUuid);
		if (!t)
			throw new NotFoundException(
				"Template '" + m.TemplateUuid + "' not found"
			);

		res.send({ html: renderMessage(t, m.payload) });
	} catch (err) {
		next(err);
	}
});

router.post("/send/:uuid", checkToken, async (req, res, next) => {
	try {
		let m = await Message.findByPk(req.params.uuid);
		if (!m)
			throw new NotFoundException(
				"Message '" + req.params.uuid + "' not found"
			);

		let t = await Template.findByPk(m.TemplateUuid);
		if (!t)
			throw new NotFoundException(
				"Template '" + m.TemplateUuid + "' not found"
			);
		let html = renderMessage(t, m.payload);

		await m.update({
			sendTo: req.body.sendTo || "",
			copyTo: req.body.copyTo || "",
			status: 1,
		});

		await sendMail(html, m.title, m.sendTo, m.copyTo);

		res.send({ ok: true, message: m });
	} catch (err) {
		next(err);
	}
});

export const messageRouter = router;
