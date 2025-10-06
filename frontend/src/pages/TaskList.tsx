import React from "react";
import TaskCard from "../components/TaskCard";

interface Task {
  id: number;
  title: string;
  skills: string[];
  status: string;
  assignee_id: number | null;
  parent_id: number | null;
}

interface Developer {
  id: number;
  name: string;
}

interface Props {
  tasks: Task[];
  developers: Developer[];
  refreshTasks: () => void;
}

const TaskList: React.FC<Props> = ({ tasks, developers, refreshTasks }) => {
  const renderTasks = (parentId: number | null = null, level = 0): JSX.Element[] => {
    return tasks
      .filter((t) => t.parent_id === parentId)
      .map((task) => [
        <TaskCard key={task.id} task={task} developers={developers} refreshTasks={refreshTasks} indentLevel={level} />,
        ...renderTasks(task.id, level + 1),
      ])
      .flat();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Task List</h1>
      <button className="mb-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={refreshTasks}>
        Refresh
      </button>
      <table className="min-w-full border rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Skills</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Assignee</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>{renderTasks()}</tbody>
      </table>
    </div>
  );
};

export default TaskList;
