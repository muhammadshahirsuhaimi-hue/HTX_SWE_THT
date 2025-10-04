import { Router } from "express";
import pool from "../db";

const router = Router();

// READ all skills
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM skills ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

export default router;
