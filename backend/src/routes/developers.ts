import { Router } from "express";
import pool from "../db";

const router = Router();

// READ all developers with their skills
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.name,
             json_agg(s.name) FILTER (WHERE s.name IS NOT NULL) as skills
      FROM developers d
      LEFT JOIN developer_skills ds ON d.id = ds.developer_id
      LEFT JOIN skills s ON ds.skill_id = s.id
      GROUP BY d.id
      ORDER BY d.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch developers" });
  }
});

export default router;
