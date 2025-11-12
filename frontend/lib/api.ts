// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true,
});

export const loginUser = (data: { email: string; password: string }) => {
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);

  return api.post("/auth/jwt/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const registerUser = (data: { email: string; password: string }) => {
  return api.post("/auth/register", data);
};

export default api;
