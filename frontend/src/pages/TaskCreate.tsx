import React, { useState, useEffect } from "react";
import { createTask, getDevelopers } from "../api";

const TaskCreate: React.FC = () => {
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<string>("");
  const [developers, setDevelopers] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    // fetch developers if needed
    // currently optional for assignment part 3
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask({ title, skills: skills.split(",").map((s) => s.trim()) });
    setTitle("");
    setSkills("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Create Task</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-50 p-4 rounded shadow"
      >
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Skills (comma separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default TaskCreate;
