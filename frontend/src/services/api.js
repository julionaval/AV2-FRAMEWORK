import axios from "axios";

export default axios.create({
  baseURL: "/api", // Vite proxy envia para localhost:4000
  withCredentials: true,
});
