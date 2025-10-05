import React, { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import { getTasks, getDevelopers } from "../api";

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

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  const fetchTasks = async () => {
    const tasksRes = await getTasks();
    setTasks(tasksRes);
  };

  const fetchDevelopers = async () => {
    const devRes = await getDevelopers();
    setDevelopers(devRes);
  };

  useEffect(() => {
    fetchTasks();
    fetchDevelopers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Task List</h1>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 border-r border-gray-300 text-left w-2/5">Title</th>
            <th className="px-2 py-1 border-r border-gray-300 text-left w-1/5">Skills</th>
            <th className="px-2 py-1 border-r border-gray-300 text-left w-1/5">Status</th>
            <th className="px-2 py-1 border-r border-gray-300 text-left w-1/5">Assignee</th>
            <th className="px-2 py-1 text-left w-1/12">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              developers={developers}
              refreshTasks={fetchTasks}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
