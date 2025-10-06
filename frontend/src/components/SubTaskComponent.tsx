import React, { useState } from "react";

interface Developer {
  id: number;
  name: string;
}

export interface TaskInput {
  title: string;
  skills: string;
  assignee_id: number;
  subtasks: TaskInput[];
}

interface SubtaskProps {
  developers: Developer[];
  subtask: TaskInput;
  setSubtask: (s: TaskInput) => void;
}

const SubtaskComponent: React.FC<SubtaskProps> = ({ developers, subtask, setSubtask }) => {

  const handleChange = (field: keyof TaskInput, value: any) => {
    setSubtask({ ...subtask, [field]: value });
  };

  const addSubtask = () => {
    setSubtask({
      ...subtask,
      subtasks: [...subtask.subtasks, { title: "", skills: "", assignee_id: 0, subtasks: [] }],
    });
  };

  const updateNestedSubtask = (index: number, updated: TaskInput) => {
    const updatedSubtasks = subtask.subtasks.map((s, i) => (i === index ? updated : s));
    setSubtask({ ...subtask, subtasks: updatedSubtasks });
  };

  return (
    <div className="ml-4 my-2 border-l-2 pl-4">
      <div className="grid grid-cols-4 gap-2 items-center mb-2">
        <input
          type="text"
          placeholder="Subtask title"
          value={subtask.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="border p-1 rounded w-full"
        />
        <input
          type="text"
          placeholder="Skills"
          value={subtask.skills}
          onChange={(e) => handleChange("skills", e.target.value)}
          className="border p-1 rounded w-full"
        />
        <select
          value={subtask.assignee_id}
          onChange={(e) => handleChange("assignee_id", parseInt(e.target.value))}
          className="border p-1 rounded w-full"
        >
          <option value={0}>Unassigned</option>
          {developers.map((dev) => (
            <option key={dev.id} value={dev.id}>{dev.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={addSubtask}
          className="bg-gray-300 px-2 py-1 rounded"
        >
          Add Subtask
        </button>
      </div>

      {subtask.subtasks.map((st, i) => (
        <SubtaskComponent
          key={i}
          developers={developers}
          subtask={st}
          setSubtask={(updated) => updateNestedSubtask(i, updated)}
        />
      ))}
    </div>
  );
};

export default SubtaskComponent;
