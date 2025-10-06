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
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? [...res.data] : []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const res = await getDevelopers();
      setDevelopers(res.data);
    } catch (err) {
      console.error("Failed to fetch developers", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDevelopers();
  }, []);

  return (
    <Router>
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <nav className="mb-6 flex gap-4 bg-gray-100 p-3 rounded shadow">
          <Link
            to="/tasks"
            className="text-blue-600 font-semibold hover:underline"
          >
            Task List
          </Link>
          <Link
            to="/create"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create Task
          </Link>
        </nav>

        {/* Page content */}
        <main className="p-4 bg-white rounded shadow">
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
