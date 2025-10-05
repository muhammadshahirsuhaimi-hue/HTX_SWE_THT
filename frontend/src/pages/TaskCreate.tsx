import React, { useState, useEffect } from "react";
import { createTask, getDevelopers } from "../api";

interface Developer {
  id: number;
  name: string;
}

const TaskCreate: React.FC<{ refreshTasks: () => void }> = ({ refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [assignee, setAssignee] = useState(0); // 0 = Unassigned
  const [developers, setDevelopers] = useState<Developer[]>([]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const devRes = await getDevelopers();
      setDevelopers(devRes);
    };
    fetchDevelopers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    await createTask({
      title,
      skills: skillsArray,
      assignee_id: assignee || null,
    });

    setTitle("");
    setSkills("");
    setAssignee(0);
    refreshTasks();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create Task</h1>

      <form onSubmit={handleSubmit}>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border-r border-gray-300 text-left w-2/5">Title</th>
              <th className="px-2 py-1 border-r border-gray-300 text-left w-2/5">Skills (comma-separated)</th>
              <th className="px-2 py-1 border-r border-gray-300 text-left w-1/5">Assignee</th>
              <th className="px-2 py-1 text-left w-1/5">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              {/* Title input */}
              <td className="px-2 py-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-1 rounded w-full"
                  placeholder="Task title"
                  required
                />
              </td>

              {/* Skills input */}
              <td className="px-2 py-1">
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="border p-1 rounded w-full"
                  placeholder="Frontend, Backend"
                />
              </td>

              {/* Assignee dropdown */}
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

              {/* Submit button */}
              <td className="px-2 py-1">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default TaskCreate;
