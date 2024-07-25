import { Router } from "express";
import { checkToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", (req, res) => {
	res.send({ ok: true, method: "GET", path: "/" });
});

router.get("/secret", checkToken, (req, res) => {
	res.send({ ok: true, method: "GET", path: "/secret" });
});

export const mainRouter = router;
