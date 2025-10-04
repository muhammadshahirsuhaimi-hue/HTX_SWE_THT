import React, { useEffect, useState } from "react";
import { getTasks, getDevelopers } from "../api";
import TaskCard from "../components/TaskCard";

interface Developer {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  skills: string[];
  status: string;
  developer_id: number | null;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  const fetchData = async () => {
    const tasksRes = await getTasks();
    setTasks(tasksRes);
    const devRes = await getDevelopers();
    setDevelopers(devRes);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Task List</h1>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            developers={developers}
            refreshTasks={fetchData}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
