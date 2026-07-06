import axios from "axios";

// Now we use the proxy in both local (Vite) and production (Vercel)
// The requests will appear to come from the same domain, so cookies work perfectly!
const baseURL = "/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;