import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	res.send({ ok: true, method: "GET", path: "/" });
});

export const mainRouter = router;
