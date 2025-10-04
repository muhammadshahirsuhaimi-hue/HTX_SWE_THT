"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// CREATE Task
router.post("/", async (req, res) => {
    const { title, skills = [], assignee_id, status = "to-do", parent_id = null } = req.body;
    try {
        // Insert task
        const result = await db_1.default.query("INSERT INTO tasks (title, status, assignee_id, parent_id) VALUES ($1, $2, $3, $4) RETURNING *", [title, status, assignee_id || null, parent_id]);
        const task = result.rows[0];
        // Insert task skills if provided
        if (skills.length > 0) {
            for (const skillId of skills) {
                await db_1.default.query("INSERT INTO task_skills (task_id, skill_id) VALUES ($1, $2)", [task.id, skillId]);
            }
        }
        res.status(201).json(task);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create task" });
    }
});
// READ all tasks
router.get("/", async (_req, res) => {
    try {
        const result = await db_1.default.query(`
      SELECT t.id, t.title, t.status, t.assignee_id, d.name as assignee,
             json_agg(s.name) FILTER (WHERE s.name IS NOT NULL) as skills
      FROM tasks t
      LEFT JOIN developers d ON t.assignee_id = d.id
      LEFT JOIN task_skills ts ON t.id = ts.task_id
      LEFT JOIN skills s ON ts.skill_id = s.id
      GROUP BY t.id, d.name
      ORDER BY t.id
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});
// UPDATE Task (assign developer / change status)
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { assignee_id, status } = req.body;
    try {
        // If assigning developer, check skills
        if (assignee_id) {
            const skillsRes = await db_1.default.query("SELECT skill_id FROM task_skills WHERE task_id = $1", [id]);
            const taskSkills = skillsRes.rows.map(r => r.skill_id);
            const devRes = await db_1.default.query("SELECT skill_id FROM developer_skills WHERE developer_id = $1", [assignee_id]);
            const devSkills = devRes.rows.map(r => r.skill_id);
            // Verify developer has required skills
            const hasAllSkills = taskSkills.every(skill => devSkills.includes(skill));
            if (!hasAllSkills) {
                return res.status(400).json({ error: "Developer does not have required skills" });
            }
        }
        // Update task
        const result = await db_1.default.query("UPDATE tasks SET assignee_id = COALESCE($1, assignee_id), status = COALESCE($2, status) WHERE id = $3 RETURNING *", [assignee_id || null, status || null, id]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update task" });
    }
});
exports.default = router;
