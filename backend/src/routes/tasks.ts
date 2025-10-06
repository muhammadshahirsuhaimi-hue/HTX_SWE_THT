import { Router } from "express";
import pool from "../db";

const router = Router();

// GET all tasks with skills
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.*,
        COALESCE(
          json_agg(s.name) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS skills
      FROM tasks t
      LEFT JOIN task_skills ts ON t.id = ts.task_id
      LEFT JOIN skills s ON ts.skill_id = s.id
      GROUP BY t.id
      ORDER BY t.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// Recursive task creation function
const createTaskRecursive = async (task: any, parent_id: number | null = null) => {
  const { title, skills = [], assignee_id = null, subtasks = [] } = task;

  // Insert main task
  const insertTask = await pool.query(
    "INSERT INTO tasks (title, assignee_id, parent_id) VALUES ($1, $2, $3) RETURNING *",
    [title, assignee_id, parent_id]
  );
  const newTask = insertTask.rows[0];

  // Handle skills
  for (let skillName of skills) {
    let skillRes = await pool.query("SELECT id FROM skills WHERE name=$1", [skillName]);
    let skill_id;
    if (skillRes.rows.length) {
      skill_id = skillRes.rows[0].id;
    } else {
      const newSkill = await pool.query(
        "INSERT INTO skills (name) VALUES ($1) RETURNING id",
        [skillName]
      );
      skill_id = newSkill.rows[0].id;
    }
    await pool.query("INSERT INTO task_skills (task_id, skill_id) VALUES ($1, $2)", [
      newTask.id,
      skill_id,
    ]);
  }

  // Recursively create subtasks (if any)
  for (let subtask of subtasks) {
    await createTaskRecursive(subtask, newTask.id);
  }

  return newTask;
};

// POST /tasks
router.post("/", async (req, res) => {
  try {
    const task = req.body;
    const createdTask = await createTaskRecursive(task);
    res.json(createdTask);
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT update task
router.put("/:id", async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { status, assignee_id } = req.body;

    console.log("Updating task:", taskId, "with", req.body);

    // check if task exists
    const taskRes = await pool.query("SELECT * FROM tasks WHERE id=$1", [taskId]);
    if (!taskRes.rows.length) return res.status(404).json({ error: "Task not found" });
    const task = taskRes.rows[0];

    // If parent task, check subtasks for "Done" validation
    if (status === "Done" && task.parent_id === null) {
      const subtasks = await pool.query("SELECT * FROM tasks WHERE parent_id=$1", [taskId]);
      if (subtasks.rows.some((st) => st.status !== "Done")) {
        return res
          .status(400)
          .json({ error: "Cannot mark parent task as Done until all subtasks are Done" });
      }
    }

    const updated = await pool.query(
      "UPDATE tasks SET status=$1, assignee_id=$2 WHERE id=$3 RETURNING *",
      [status ?? task.status, assignee_id ?? task.assignee_id, taskId]
    );

    console.log("Updated task:", updated.rows[0]);
    res.json(updated.rows[0]);
  } catch (err) {
    console.error("updateTask error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

export default router;
