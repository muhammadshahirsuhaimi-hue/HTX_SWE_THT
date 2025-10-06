import axios from "axios";

// Change this to your backend URL
const API_BASE = "http://localhost:3001"; // default backend port

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------- Task APIs -------------------

export interface TaskPayload {
  title: string;
  skills: string[];
  assignee_id?: number | null;
  parent_id?: number | null; // for subtasks
  subtasks?: TaskPayload[];  // nested subtasks
}

// Fetch all tasks
export const getTasks = async () => {
  try {
    const res = await api.get("/tasks");
    return res.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err; // allow frontend to handle error
  }
};

// Create task (with optional subtasks)
export const createTask = async (task: TaskPayload) => {
  try {
    const res = await api.post("/tasks", task);
    return res.data;
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
};

// Update task (status, assignee)
export const updateTask = async (
  id: number,
  updates: { status?: string; assignee_id?: number | null }
) => {
  try {
    const res = await api.put(`/tasks/${id}`, updates);
    return res.data;
  } catch (err) {
    console.error("Error updating task:", err);
    throw err;
  }
};

// ------------------- Developer APIs -------------------

export const getDevelopers = async () => {
  try {
    const res = await api.get("/developers");
    return res.data;
  } catch (err) {
    console.error("Error fetching developers:", err);
    throw err;
  }
};

// ------------------- Skills APIs -------------------

export const getSkills = async () => {
  try {
    const res = await api.get("/skills");
    return res.data;
  } catch (err) {
    console.error("Error fetching skills:", err);
    throw err;
  }
};

export default api;
