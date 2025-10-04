"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// READ all developers with their skills
router.get("/", async (_req, res) => {
    try {
        const result = await db_1.default.query(`
      SELECT d.id, d.name,
             json_agg(s.name) FILTER (WHERE s.name IS NOT NULL) as skills
      FROM developers d
      LEFT JOIN developer_skills ds ON d.id = ds.developer_id
      LEFT JOIN skills s ON ds.skill_id = s.id
      GROUP BY d.id
      ORDER BY d.id
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch developers" });
    }
});
exports.default = router;
