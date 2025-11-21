import axios from "axios";

const base = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({ baseURL: base });

export default client;
