import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskList from "./pages/TaskList";
import TaskCreate from "./pages/TaskCreate";
import { getTasks, getDevelopers } from "./api";

interface Developer {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  skills: string[];
  status: string;
  assignee_id: number | null;
  parent_id: number | null;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Unexpected task response:", data);
        setTasks([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err);
      setTasks([]);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const data = await getDevelopers();
      if (Array.isArray(data)) {
        setDevelopers(data);
      } else {
        console.error("Unexpected developer response:", data);
        setDevelopers([]);
      }
    } catch (err) {
      console.error("Failed to fetch developers:", err);
      setDevelopers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDevelopers();
  }, []);

  return (
    <Router>
      <div className="max-w-5xl mx-auto">
        <nav className="mb-6 flex gap-4 bg-gray-100 p-3 rounded shadow">
          <Link to="/tasks" className="text-blue-600 font-semibold hover:underline" style={{ padding: '0% 2% 0% 2%' }}>
            Task List
          </Link>
          <Link to="/create" className="text-blue-600 font-semibold hover:underline" style={{ padding: '0% 2% 0% 2%' }}>
            Create Task
          </Link>
        </nav>

        <main className="p-6 bg-white rounded shadow">
          <Routes>
            <Route
              path="/tasks"
              element={
                <TaskList
                  tasks={tasks}
                  developers={developers}
                  refreshTasks={fetchTasks}
                />
              }
            />
            <Route
              path="/create"
              element={
                <TaskCreate
                  developers={developers}
                  refreshTasks={fetchTasks}
                />
              }
            />
            <Route
              path="*"
              element={
                <TaskList
                  tasks={tasks}
                  developers={developers}
                  refreshTasks={fetchTasks}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
