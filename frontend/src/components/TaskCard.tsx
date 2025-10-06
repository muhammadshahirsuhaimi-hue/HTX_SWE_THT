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
}

const TaskCard: React.FC<Props> = ({ task, developers, refreshTasks }) => {
  const [status, setStatus] = useState(task.status);
  const [assignee, setAssignee] = useState(task.assignee_id || 0);

  const handleUpdate = async () => {
    try {
      await updateTask(task.id, { status, assignee_id: assignee || null });
      refreshTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task. Check console for details.");
    }
  };

  return (
    <tr className="border-b border-gray-300">
      {/* Task Title */}
      <td className="px-2 py-1">{task.title}</td>

      {/* Skills */}
      <td className="px-2 py-1">{task.skills.join(", ")}</td>

      {/* Status Dropdown */}
      <td className="px-2 py-1">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-1 rounded w-full"
        >
          <option value="To-do">To-do</option>
          <option value="Done">Done</option>
        </select>
      </td>

      {/* Assignee Dropdown */}
      <td className="px-2 py-1">
        <select
          value={assignee}
          onChange={(e) => setAssignee(parseInt(e.target.value))}
          className="border p-1 rounded w-full"
        >
          <option value={0}>Unassigned</option>
          {developers.map((dev) => (
            <option key={dev.id} value={dev.id}>
              {dev.name}
            </option>
          ))}
        </select>
      </td>

      {/* Update Button */}
      <td className="px-2 py-1">
        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Update
        </button>
      </td>
    </tr>
  );
};

export default TaskCard;
