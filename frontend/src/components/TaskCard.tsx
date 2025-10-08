import React, { useState } from "react";
import { updateTask } from "../api";

interface Task {
  id: number;
  title: string;
  skills: string[];
  status: string;
  assignee_id: number | null;
  parent_id: number | null;
}

interface Developer {
  id: number;
  name: string;
}

interface Props {
  task: Task;
  developers: Developer[];
  refreshTasks: () => void;
  indentLevel?: number; // for subtask indentation
}

const TaskCard: React.FC<Props> = ({ task, developers, refreshTasks, indentLevel = 0 }) => {
  const [status, setStatus] = useState(task.status);
  const [assignee, setAssignee] = useState(task.assignee_id || 0);

  const handleUpdate = async () => {
    try {
      await updateTask(task.id, { status, assignee_id: assignee || null });
      refreshTasks();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.response?.data?.error || "Update failed");
    }
  };

  return (
    <tr className="table-row">
      <td style={{ paddingLeft: `${indentLevel * 20}px` }}>{task.title}</td>
      <td>{(task.skills || []).join(", ")}</td>
      <td>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field"
        >
          <option value="To-do">To-do</option>
          <option value="In-progress">In-progress</option>
          <option value="Done">Done</option>
        </select>
      </td>
      <td>
        <select
          value={assignee}
          onChange={(e) => setAssignee(parseInt(e.target.value))}
          className="input-field"
        >
          <option value={0}>Unassigned</option>
          {developers.map((dev) => (
            <option key={dev.id} value={dev.id}>
              {dev.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <button onClick={handleUpdate} className="button button-primary">
          Update
        </button>
      </td>
    </tr>
  );
};

export default TaskCard;
