import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4013/api",
  withCredentials: true, // if JWT in cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `EventEngine ${token}`;

  return config;
});

export default axiosInstance;
