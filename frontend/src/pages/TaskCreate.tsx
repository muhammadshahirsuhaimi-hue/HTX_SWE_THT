import React, { useState } from "react";
import { createTask, TaskPayload } from "../api";

interface Developer {
  id: number;
  name: string;
}

interface TaskRow {
  title: string;
  skills: string[];
  assignee_id: number | null;
  subtasks?: TaskRow[];
}

interface Props {
  developers: Developer[];
  refreshTasks: () => void;
}

const MAX_SUBTASK_DEPTH = 4;

const TaskCreate: React.FC<Props> = ({ developers, refreshTasks }) => {
  const [tasks, setTasks] = useState<TaskRow[]>([
    { title: "", skills: [], assignee_id: null, subtasks: [] },
  ]);
  const [loading, setLoading] = useState(false);

  // Update task field
  const updateTaskField = (path: number[], field: keyof TaskRow, value: any) => {
    const copy = [...tasks];
    let ref: any = copy;
    for (let i = 0; i < path.length; i++) {
      ref = ref[path[i]];
      if (i < path.length - 1) ref = ref.subtasks!;
    }
    ref[field] = value;
    setTasks(copy);
  };

  // Add subtask
  const addSubtask = (path: number[], depth: number) => {
    if (depth >= MAX_SUBTASK_DEPTH) return;
    const copy = [...tasks];
    let ref: any = copy;
    for (let i = 0; i < path.length; i++) {
      ref = ref[path[i]];
      if (i < path.length - 1) ref = ref.subtasks!;
    }
    ref.subtasks = ref.subtasks || [];
    ref.subtasks.push({ title: "", skills: [], assignee_id: null, subtasks: [] });
    setTasks(copy);
  };

  // Flatten tasks for rendering table rows
  const flattenTasks = (taskList: TaskRow[], depth = 0, path: number[] = []) => {
    let rows: { task: TaskRow; depth: number; path: number[] }[] = [];
    taskList.forEach((task, idx) => {
      const currentPath = [...path, idx];
      rows.push({ task, depth, path: currentPath });
      if (task.subtasks && task.subtasks.length > 0) {
        rows = rows.concat(flattenTasks(task.subtasks, depth + 1, currentPath));
      }
    });
    return rows;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: TaskPayload = tasks[0]; // Top-level parent task
      await createTask(payload);
      await refreshTasks();
      // Reset form
      setTasks([{ title: "", skills: [], assignee_id: null, subtasks: [] }]);
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const rows = flattenTasks(tasks);

  return (
    <div className="container">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Skills (comma separated)</th>
              <th>Assignee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ task, depth, path }, idx) => (
              <tr key={idx}>
                <td style={{ paddingLeft: `${depth * 20}px` }}>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTaskField(path, "title", e.target.value)}
                    className="input-field"
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={task.skills.join(", ")}
                    onChange={(e) =>
                      updateTaskField(
                        path,
                        "skills",
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    className="input-field"
                  />
                </td>
                <td>
                  <select
                    value={task.assignee_id ?? ""}
                    onChange={(e) =>
                      updateTaskField(
                        path,
                        "assignee_id",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="input-field"
                  >
                    <option value="">Unassigned</option>
                    {developers.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {depth < MAX_SUBTASK_DEPTH && (
                    <button
                      type="button"
                      onClick={() => addSubtask(path, depth)}
                      className="button"
                    >
                      Add Subtask
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="button button-primary">
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;
