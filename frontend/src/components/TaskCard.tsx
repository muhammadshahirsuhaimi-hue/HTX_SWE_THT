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
    <div className="border p-4 mb-3 rounded shadow">
      <h2 className="font-semibold">{task.title}</h2>
      <p className="text-sm text-gray-500 mb-2">
        Skills: {task.skills.join(", ")}
      </p>

      <div className="flex items-center gap-2 mb-2">
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="To-do">To-do</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <label>Assignee:</label>
        <select
          value={assignee}
          onChange={(e) => setAssignee(parseInt(e.target.value))}
          className="border p-1 rounded"
        >
          <option value={0}>Unassigned</option>
          {developers.map((dev) => (
            <option key={dev.id} value={dev.id}>
              {dev.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Update
      </button>
    </div>
  );
};

export default TaskCard;
