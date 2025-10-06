import axios from "axios";

const API_BASE = "http://localhost:3001";

const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });

export interface TaskPayload {
  title: string;
  skills: string[];
  assignee_id?: number | null;
  parent_id?: number | null;
}

// Task APIs
export const getTasks = async () => (await api.get("/tasks")).data;
export const createTask = async (task: TaskPayload) => (await api.post("/tasks", task)).data;
export const updateTask = async (id: number, updates: { status?: string; assignee_id?: number | null }) =>
  (await api.put(`/tasks/${id}`, updates)).data;
export const deleteTask = async (id: number) => (await api.delete(`/tasks/${id}`)).data;

// Developer APIs
export const getDevelopers = async () => (await api.get("/developers")).data;

// Skills APIs
export const getSkills = async () => (await api.get("/skills")).data;

export default api;
