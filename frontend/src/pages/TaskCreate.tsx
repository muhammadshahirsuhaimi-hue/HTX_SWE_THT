import React, { useEffect, useState } from "react";
import { getDevelopers, createTask } from "../api";

interface Developer {
  id: number;
  name: string;
}

interface TaskInput {
  title: string;
  skills: string[];
  developer_id: number | null;
  subtasks?: TaskInput[];
}

const TaskCreate: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [mainTask, setMainTask] = useState<TaskInput>({
    title: "",
    skills: [],
    developer_id: null,
    subtasks: [],
  });

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const devs = await getDevelopers();
        setDevelopers(devs || []);
      } catch (err) {
        console.error("Error fetching developers:", err);
      }
    };
    fetchDevelopers();
  }, []);

  const handleAddSubtask = () => {
    setMainTask({
      ...mainTask,
      subtasks: [
        ...(mainTask.subtasks || []),
        { title: "", skills: [], developer_id: null },
      ],
    });
  };

  const handleSubtaskChange = (
    index: number,
    field: keyof TaskInput,
    value: string | number | null
  ) => {
    const updatedSubtasks = [...(mainTask.subtasks || [])];
    if (field === "skills") {
      updatedSubtasks[index][field] = (value as string)
        .split(",")
        .map((s) => s.trim());
    } else {
      updatedSubtasks[index][field] = value as any;
    }
    setMainTask({ ...mainTask, subtasks: updatedSubtasks });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(mainTask);
      alert("Task and subtasks created successfully!");
      setMainTask({ title: "", skills: [], developer_id: null, subtasks: [] });
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Create Task</h1>

      <form onSubmit={handleSubmit}>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Skills</th>
              <th className="border p-2 text-left">Assignee</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Main task row */}
            <tr className="bg-white">
              <td className="border p-2">
                <input
                  type="text"
                  value={mainTask.title}
                  onChange={(e) =>
                    setMainTask({ ...mainTask, title: e.target.value })
                  }
                  className="border p-1 rounded w-full"
                  placeholder="Task title"
                  required
                />
              </td>

              <td className="border p-2">
                <input
                  type="text"
                  value={mainTask.skills.join(", ")}
                  onChange={(e) =>
                    setMainTask({
                      ...mainTask,
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  className="border p-1 rounded w-full"
                  placeholder="Skills, e.g., Frontend, Backend"
                />
              </td>

              <td className="border p-2">
                <select
                  value={mainTask.developer_id ?? 0}
                  onChange={(e) =>
                    setMainTask({
                      ...mainTask,
                      developer_id: Number(e.target.value) || null,
                    })
                  }
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

              <td className="border p-2">
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Add Subtask
                </button>
              </td>
            </tr>

            {/* Subtasks */}
            {mainTask.subtasks?.map((subtask, idx) => (
              <tr key={idx} className="bg-gray-50">
                <td className="border p-2">
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) =>
                      handleSubtaskChange(idx, "title", e.target.value)
                    }
                    className="border p-1 rounded w-full"
                    placeholder="Subtask title"
                    required
                  />
                </td>

                <td className="border p-2">
                  <input
                    type="text"
                    value={subtask.skills.join(", ")}
                    onChange={(e) =>
                      handleSubtaskChange(idx, "skills", e.target.value)
                    }
                    className="border p-1 rounded w-full"
                    placeholder="Skills, e.g., Frontend, Backend"
                  />
                </td>

                <td className="border p-2">
                  <select
                    value={subtask.developer_id ?? 0}
                    onChange={(e) =>
                      handleSubtaskChange(
                        idx,
                        "developer_id",
                        Number(e.target.value) || null
                      )
                    }
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

                <td className="border p-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(mainTask.subtasks || [])];
                      updated.splice(idx, 1);
                      setMainTask({ ...mainTask, subtasks: updated });
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;
