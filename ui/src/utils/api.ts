import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";
if (localStorage.getItem(import.meta.env.VITE_TOKEN_NAME)) {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem(import.meta.env.VITE_TOKEN_NAME);
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
});

export default api;
