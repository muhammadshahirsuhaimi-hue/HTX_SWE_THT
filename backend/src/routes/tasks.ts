import express from "express";
import pool from "../db";

const router = express.Router();

// ------------------- POST /tasks -------------------
router.post("/", async (req, res) => {
  const task = req.body;

  if (!task || !task.title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Insert main task
    const mainTaskRes = await client.query(
      `INSERT INTO tasks (title, status, assignee_id)
       VALUES ($1, $2, $3) RETURNING id`,
      [task.title, task.status || "to-do", task.assignee_id || null]
    );

    const mainTaskId = mainTaskRes.rows[0].id;

    // 2️. Insert main task skills
    if (task.skills && task.skills.length > 0) {
      for (const skillName of task.skills) {
        const skillRes = await client.query(
          `SELECT id FROM skills WHERE name = $1`,
          [skillName]
        );
        if (skillRes.rows.length === 0) {
          console.warn(`Skill "${skillName}" not found in DB`);
          continue;
        }
        await client.query(
          `INSERT INTO task_skills (task_id, skill_id) VALUES ($1, $2)`,
          [mainTaskId, skillRes.rows[0].id]
        );
      }
    }

    // 3️. Insert subtasks (only one level)
    if (task.subtasks && task.subtasks.length > 0) {
      for (const subtask of task.subtasks) {
        const subtaskRes = await client.query(
          `INSERT INTO tasks (title, status, assignee_id, parent_id)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [subtask.title, subtask.status || "to-do", subtask.assignee_id || null, mainTaskId]
        );
        const subtaskId = subtaskRes.rows[0].id;

        // Insert skills for subtask
        if (subtask.skills && subtask.skills.length > 0) {
          for (const skillName of subtask.skills) {
            const skillRes = await client.query(
              `SELECT id FROM skills WHERE name = $1`,
              [skillName]
            );
            if (skillRes.rows.length === 0) {
              console.warn(`Skill "${skillName}" not found in DB`);
              continue;
            }
            await client.query(
              `INSERT INTO task_skills (task_id, skill_id) VALUES ($1, $2)`,
              [subtaskId, skillRes.rows[0].id]
            );
          }
        }
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ taskId: mainTaskId });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Failed to create task:", err);
    res.status(500).json({ error: "Failed to create task", details: err.message });
  } finally {
    client.release();
  }
});

// ------------------- GET /tasks -------------------
router.get("/", async (req, res) => {
  try {
    const tasksRes = await pool.query(`
      SELECT
        t.id,
        t.title,
        t.status,
        t.assignee_id,
        t.parent_id,
        COALESCE(
          ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL),
          '{}'
        ) AS skills
      FROM tasks t
      LEFT JOIN task_skills ts ON t.id = ts.task_id
      LEFT JOIN skills s ON ts.skill_id = s.id
      GROUP BY t.id, t.parent_id
      ORDER BY t.id
    `);

    res.json(tasksRes.rows);
  } catch (err: any) {
    console.error("Failed to fetch tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks", details: err.message });
  }
});

export default router;
