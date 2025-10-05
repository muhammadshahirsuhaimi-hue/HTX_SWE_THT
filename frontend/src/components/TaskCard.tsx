import React, { useState } from "react";
import { updateTask } from "../api";

interface Task {
  id: number;
  title: string;
  skills: string[];
  status: string;
  developer_id: number | null;
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
  const [assignee, setAssignee] = useState(task.developer_id || 0);

  const handleUpdate = async () => {
    await updateTask(task.id, { status, developer_id: assignee || null });
    refreshTasks();
  };

  return (
    <tr className="border-b border-gray-300">
      {/* Title */}
      <td className="px-2 py-1">{task.title}</td>

      {/* Skills */}
      <td className="px-2 py-1">{task.skills.join(", ")}</td>

      {/* Status */}
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

      {/* Assignee */}
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

      {/* Update button */}
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
