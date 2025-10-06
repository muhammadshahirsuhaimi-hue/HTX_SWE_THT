import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import { getTasks, getDevelopers } from "../api";

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

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshTasks = async () => {
    setLoading(true);
    try {
      const [tasksRes, devsRes] = await Promise.all([getTasks(), getDevelopers()]);
      setTasks(tasksRes || []);
      setDevelopers(devsRes || []);
    } catch (err) {
      console.error("Error fetching tasks/developers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  if (loading) return <div>Loading...</div>;

  const mainTasks = tasks.filter((t) => !t.parent_id);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Task List</h1>
      <button
        className="mb-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        onClick={refreshTasks}
      >
        Refresh
      </button>

      <table className="min-w-full border rounded shadow">
        <thead>
          <tr>
            <th className="px-2 py-1">Title</th>
            <th className="px-2 py-1">Skills</th>
            <th className="px-2 py-1">Status</th>
            <th className="px-2 py-1">Assignee</th>
            <th className="px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {mainTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              developers={developers}
              refreshTasks={refreshTasks}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
