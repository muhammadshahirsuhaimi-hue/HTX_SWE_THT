import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskList from "./pages/TaskList";
import TaskCreate from "./pages/TaskCreate";

const App: React.FC = () => {
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
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/create" element={<TaskCreate />} />
            <Route path="*" element={<TaskList />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
};

export default App;
