import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ data: { status: "ok" } });
});

export default router;
