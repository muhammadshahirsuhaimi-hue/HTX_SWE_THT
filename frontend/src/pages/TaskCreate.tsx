import React, { useState } from "react";
import { createTask } from "../api";

interface Developer {
  id: number;
  name: string;
}

interface Props {
  developers: Developer[];
  refreshTasks: () => void;
}

const TaskCreate: React.FC<Props> = ({ developers, refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [assignee, setAssignee] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter((x) => x !== s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");

    try {
      setLoading(true);
      await createTask({
        title,
        skills,
        status: "pending",
        assignee_id: assignee,
        parent_id: null,
      });
      await refreshTasks();
      setTitle("");
      setSkills([]);
      setAssignee(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="py-2 px-4 w-1/4 font-semibold">Title:</td>
              <td className="py-2 px-4">
                <input
                  className="border rounded w-full px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold">Skills:</td>
              <td className="py-2 px-4">
                <div className="flex gap-2 mb-2">
                  <input
                    className="border rounded flex-1 px-3 py-2"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Enter skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-500 text-white px-3 rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="bg-gray-200 px-2 py-1 rounded cursor-pointer"
                      onClick={() => removeSkill(s)}
                    >
                      {s} ✕
                    </span>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold">Assignee:</td>
              <td className="py-2 px-4">
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={assignee ?? ""}
                  onChange={(e) =>
                    setAssignee(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">Select developer</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskCreate;
