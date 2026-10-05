import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function loginApi(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
}

export async function registerApi(email: string, password: string) {
    const res = await api.post("/auth/register", { email, password });
    return res.data;
}

export interface Incident {
    _id: string;
    title: string;
    description: string;
    category: "fire" | "flood" | "accident" | "medical" | "other";
    status: "open" | "in_progress" | "closed";
    location: {
        lat: number;
        lng: number;
    };
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateIncidentInput {
    title: string;
    description: string;
    category: string;
    location: {
        lat: number;
        lng: number;
    };
}

export async function getIncidentsApi(category?: string) {
    const params = category && category !== "all" ? { category } : {};
    const res = await api.get("/incidents", { params });
    return res.data;
}

export async function createIncidentApi(data: CreateIncidentInput) {
    const res = await api.post("/incidents", data);
    return res.data;
}

export interface UpdateIncidentInput {
    title?: string;
    description?: string;
    category?: string;
    status?: string;
}

export async function updateIncidentApi(id: string, data: UpdateIncidentInput) {
    const res = await api.patch(`/incidents/${id}`, data);
    return res.data;
}

export async function deleteIncidentApi(id: string) {
    const res = await api.delete(`/incidents/${id}`);
    return res.data;
}
