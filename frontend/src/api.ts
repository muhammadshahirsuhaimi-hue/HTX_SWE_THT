import axios from "axios";

// Change this to your backend URL
const API_BASE = "http://localhost:3000"; // default backend port

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------- Task APIs -------------------

export const getTasks = async () => {
  try {
    const res = await api.get("/tasks");
    return res.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
};

export const createTask = async (task: {
  title: string;
  skills: string[];
}) => {
  try {
    const res = await api.post("/tasks", task);
    return res.data;
  } catch (err) {
    console.error("Error creating task:", err);
  }
};

export const updateTask = async (
  id: number,
  updates: { status?: string; developer_id?: number | null }
) => {
  try {
    const res = await api.put(`/tasks/${id}`, updates);
    return res.data;
  } catch (err) {
    console.error("Error updating task:", err);
  }
};

// ------------------- Developer APIs -------------------

export const getDevelopers = async () => {
  try {
    const res = await api.get("/developers");
    return res.data;
  } catch (err) {
    console.error("Error fetching developers:", err);
    return [];
  }
};

// ------------------- Skills APIs -------------------

export const getSkills = async () => {
  try {
    const res = await api.get("/skills");
    return res.data;
  } catch (err) {
    console.error("Error fetching skills:", err);
    return [];
  }
};

export default api;
