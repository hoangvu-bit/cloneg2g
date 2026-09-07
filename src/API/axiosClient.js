import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://cloneg2g-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to all outgoing requests
axiosClient.interceptors.request.use(
  (config) => {
    let token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && typeof window !== "undefined") {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        token = currentUser?.token;
      } catch (e) { }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
